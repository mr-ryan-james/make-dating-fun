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

const INTROS = gql`
  fragment UserFragment on User {
    id
    notificationCounts {
      likesIncoming
      __typename
    }
    __typename
  }

  fragment UserrowMatchFragment on Match {
    matchPercent
    senderLikeTime
    targetLikeTime
    likeTime
    senderMessageTime
    targetMessageTime
    targetLikeViaSpotlight
    senderPassed
    firstMessage {
      text
      __typename
    }
    user {
      id
      username
      displayname
      age
      isOnline
      location {
        summary
        __typename
      }
      primaryImage {
        id
        square225
        __typename
      }
      primaryImageBlurred {
        square225
        __typename
      }
      __typename
    }
    __typename
  }

  fragment UserrowMatchPreviewFragment on MatchPreview {
    primaryImageBlurred {
      square225
      __typename
    }
    __typename
  }

  query userrowsIntros($userid: String!, $after: String) {
    user(id: $userid) {
      ...UserFragment
      likes: intros(after: $after) {
        data {
          ... on Match {
            ...UserrowMatchFragment
            __typename
          }
          ... on MatchPreview {
            ...UserrowMatchPreviewFragment
            __typename
          }
          __typename
        }
        pageInfo {
          after
          hasMore
          total
          __typename
        }
        __typename
      }
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

const IntroRow = ({ like }) => {
  return (
    <TableRow>
      <TableCell>
        <img
          className="woman"
          src={like.user.primaryImage.square225}
          alt="Sara"
        ></img>
      </TableCell>
      <TableCell>
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://www.okcupid.com/profile/${like.user.id}`}
        >
          {like.user.displayname}
        </a>
      </TableCell>
      <TableCell>
        <span dangerouslySetInnerHTML={{ __html: like.firstMessage.text }} />
      </TableCell>
      <TableCell>{`${formatDate(like.targetMessageTime)}`}</TableCell>
    </TableRow>
  );
};

export default function Intros() {
  const classes = useStyles();

  const { loading, error, data } = useQuery(INTROS, {
    variables: {
      userid: "10861555661426865863",
    },
  });

  if (loading) {
    return <span>Loading....</span>;
  }

  const {
    user: {
      likes: { data: likes },
    },
  } = data;

  return (
    <React.Fragment>
      <Title>Intros</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Intro</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {likes
            .slice()
            .filter((x) => x.__typename === "Match")
            .sort((a, b) => b.targetMessageTime - a.targetMessageTime)
            .map((like) => (
              <IntroRow key={like.user.id} like={like} />
            ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more intros
        </Link>
      </div>
    </React.Fragment>
  );
}
