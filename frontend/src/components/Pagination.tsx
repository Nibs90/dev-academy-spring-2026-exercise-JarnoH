import "../styles/Pagination.css";
//Props for pagination component
type Props = {
  page: number;
  totalPages: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

//Simple pagination component
export default function Pagination(props: Props) {
  return (
    <div className="pagination">
      <button disabled={!props.canPrev} onClick={props.onPrev}>
        Prev
      </button>

      <span>
        Page {props.page} / {props.totalPages}
      </span>

      <button disabled={!props.canNext} onClick={props.onNext}>
        Next
      </button>
    </div>
  );
}
