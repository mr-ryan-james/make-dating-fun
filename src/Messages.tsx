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

const MESSAGES = gql`
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

const MessageRow = ({ message }) => {
  return (
    <TableRow>
      <TableCell>
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://www.okcupid.com/profile/${message.correspondent.user.id}`}
        >
          <img
            className="woman"
            src={message.correspondent.user.primaryImage.square225}
            alt="Sara"
          ></img>
        </a>
      </TableCell>
      <TableCell>{message.correspondent.user.displayname}</TableCell>
      <TableCell>
        <span dangerouslySetInnerHTML={{ __html: message.snippet?.text }} />
      </TableCell>
      <TableCell>{`${formatDate(message.sentTime)}`}</TableCell>
    </TableRow>
  );
};

export default function Messages() {
  const classes = useStyles();

  const { loading, error, data } = useQuery(MESSAGES, {
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
      <Title>Messages</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {messages
            .slice()
            .filter((message) => !!message.correspondent)
            .sort((a, b) => b.sentTime - a.sentTime)
            .map((message) => (
              <MessageRow
                key={message.correspondent.user.id}
                message={message}
              />
            ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more messages
        </Link>
      </div>
    </React.Fragment>
  );
}
