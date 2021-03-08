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

  fragment PromoFragment on Promo {
    upsellType
    featureType
    name
    __typename
  }

  query userrowsIncomingLikes($userid: String!, $after: String) {
    user(id: $userid) {
      ...UserFragment
      likes: likesIncomingWithPreviews(after: $after) {
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
      lastBoost {
        id
        startTime
        endTime
        __typename
      }
      promosForPage(page: LIKES_INCOMING) {
        ...PromoFragment
        __typename
      }
      __typename
    }
  }
`;

function getMoreLikes(fetchMore, pageInfo, event) {
  event.preventDefault();

  console.log("pageInfo", pageInfo);
  console.log("fetchMore", fetchMore);

  fetchMore({
    variables: {
      userid: "10861555661426865863",
      after: pageInfo.after,
    },
  });
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const LikeRow = ({ like }) => {
  console.log("like", like);
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
      <TableCell>{like.user.location.summary}</TableCell>
    </TableRow>
  );
};

export default function Likes() {
  const classes = useStyles();

  const { loading, error, data, fetchMore } = useQuery(INTROS, {
    variables: {
      userid: "10861555661426865863",
    },
  });

  const dataContainer = data?.user?.likes;

  const likes = dataContainer?.data;
  const pageInfo = dataContainer?.pageInfo;

  if (loading) {
    return <span>Loading....</span>;
  }

  return (
    <React.Fragment>
      <Title>Likes</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {likes
            .slice()
            .sort((a, b) => b.targetMessageTime - a.targetMessageTime)
            .map((like) => (
              <LikeRow key={like.user.id} like={like} />
            ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link
          color="primary"
          href="#"
          onClick={getMoreLikes.bind(null, fetchMore, pageInfo)}
        >
          See more likes
        </Link>
      </div>
    </React.Fragment>
  );
}
