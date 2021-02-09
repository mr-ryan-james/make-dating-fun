import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { useQuery, gql } from "@apollo/client";
import { formatDate } from "./utils";
import { Button } from "@material-ui/core";
import { Send } from "@material-ui/icons";

const MATCHES = gql`
  fragment ArchivedConversationCount on User {
    conversationCounts {
      archived
      __typename
    }
    __typename
  }

  fragment ConversationMatch on Match {
    senderLikeTime
    targetLikeTime
    targetLikeViaSpotlight
    senderMessageTime
    targetMessageTime
    matchPercent
    user {
      id
      displayname
      username
      age
      isOnline
      primaryImage {
        id
        square225
        __typename
      }
      __typename
    }
    __typename
  }

  fragment Conversation on Conversation {
    threadid
    time
    isUnread
    sentTime
    receivedTime
    status
    correspondent {
      ...ConversationMatch
      __typename
    }
    snippet {
      text
      sender {
        id
        __typename
      }
      __typename
    }
    __typename
  }

  fragment MutualMatch on MutualMatch {
    status
    match {
      ...ConversationMatch
      __typename
    }
    __typename
  }

  fragment ConversationsAndMatches on User {
    notificationCounts {
      messages
      __typename
    }
    conversationsAndMatches(filter: $filter, after: $after) {
      data {
        ...Conversation
        ...MutualMatch
        __typename
      }
      pageInfo {
        hasMore
        after
        total
        __typename
      }
      __typename
    }
    __typename
  }

  query WebGetMessagesMain(
    $userid: String!
    $filter: ConversationsAndMatchesFilter!
    $after: String
  ) {
    user(id: $userid) {
      id
      ...ConversationsAndMatches
      ...ArchivedConversationCount
      __typename
    }
  }
`;

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const MatchRow = ({ matchEdge, onSendIcebreaker }) => {
  return (
    <TableRow>
      <TableCell>
        <img
          className="woman"
          src={matchEdge.match.user.primaryImage.square225}
          alt="Sara"
        ></img>
      </TableCell>
      <TableCell>
        <Button
          onClick={() => onSendIcebreaker(matchEdge.match.user)}
          aria-label="send"
          startIcon={<Send />}
        >
          Icebreaker
        </Button>
      </TableCell>
      <TableCell>{matchEdge.match.user.displayname}</TableCell>
      <TableCell>{`${formatDate(matchEdge.match.senderLikeTime)}`}</TableCell>
    </TableRow>
  );
};

function sendIceBreaker(user) {
  const messageObj = {
    service: "other",
    source: "desktop_global",
    body: `Hey ${user.displayname} 👋 What are your Sunday priorities: Netflix, yoga, mimosa-ing, or something else?`,
    receiverid: user.id,
  };

  console.log();
}

export default function Matches() {
  const classes = useStyles();

  const { loading, error, data } = useQuery(MATCHES, {
    variables: {
      userid: "10861555661426865863",
      filter: "ALL",
    },
  });

  if (loading) {
    return <span>Loading....</span>;
  }

  const {
    user: {
      conversationsAndMatches: { data: messages },
    },
  } = data;

  return (
    <React.Fragment>
      <Title>Matches</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {messages
            .slice()
            .filter((message) => !message.correspondent)
            .sort((a, b) => b.match.senderLikeTime - a.match.senderLikeTime)
            .map((matchEdge) => (
              <MatchRow
                onSendIcebreaker={sendIceBreaker}
                key={matchEdge.match.user.id}
                matchEdge={matchEdge}
              />
            ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more matches
        </Link>
      </div>
    </React.Fragment>
  );
}
