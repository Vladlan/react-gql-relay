import * as React from "react";
import Story from "./Story";
import { graphql } from "relay-runtime";
import { useLazyLoadQuery, useFragment, usePaginationFragment } from "react-relay";
import type { NewsfeedQuery$data, NewsfeedQuery as NewsfeedQueryType } from "./__generated__/NewsfeedQuery.graphql";
import type { NewsfeedContentsFragment$key } from "./__generated__/NewsfeedContentsFragment.graphql";
import type { NewsfeedContentsRefetchQuery$data } from "./__generated__/NewsfeedContentsRefetchQuery.graphql";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";

const NewsfeedContentsFragment = graphql`
  fragment NewsfeedContentsFragment on Query
  @argumentDefinitions(
    cursor: { type: "String" }
    count: { type: "Int", defaultValue: 3 }
  )
  @refetchable(queryName: "NewsfeedContentsRefetchQuery") {
    viewer {
      newsfeedStories(after: $cursor, first: $count)
        @connection(key: "NewsfeedContentsFragment_newsfeedStories") {
        edges {
          node {
            id
            ...StoryFragment
          }
        }
      }
    }
  }
`;

const NewsfeedQuery = graphql`
  query NewsfeedQuery {
    ...NewsfeedContentsFragment
  }
`;

function NewsfeedContents({query}: {query: NewsfeedQuery$data}) {
  const {
    data,
    loadNext,
    hasNext,
    isLoadingNext,
  } = usePaginationFragment<NewsfeedQueryType, NewsfeedContentsFragment$key>(NewsfeedContentsFragment, query);
  function onEndReached() {
    loadNext(3);
  }
  const storyEdges = data.viewer.newsfeedStories.edges;
  return (
    <>
      {storyEdges.map(storyEdge =>
        <Story key={storyEdge.node.id} story={storyEdge.node} />
      )}
      <InfiniteScrollTrigger
        onEndReached={onEndReached}
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
      />
    </>
  );
}

export default function Newsfeed() {
  const queryData = useLazyLoadQuery<NewsfeedQueryType>(NewsfeedQuery, {});
  return (
    <div className="newsfeed">
      <NewsfeedContents query={queryData}/>
    </div>
  );
}
