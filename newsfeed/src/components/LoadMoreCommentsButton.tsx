import * as React from "react";

type Props = {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function LoadMoreCommentsButton({
  onClick,
  disabled,
  children,
}: Props): React.ReactElement {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="comments__loadMore"
    >
      Load more comments
      { children }
    </button>
  );
}
