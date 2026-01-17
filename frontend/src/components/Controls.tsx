import "../styles/Controls.css";

type Props = {
  from: string;
  to: string;
  limit: number;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
  setLimit: (v: number) => void;
  onApply: () => void;
  onClear: () => void;
};

//Controlled component for any filter controls
export default function Controls(props: Props) {
  return (
    <div className="controls">
      <div className="controlsGroup">
        <label>From</label>
        <input
          value={props.from}
          onChange={(e) => props.setFrom(e.target.value)}
        />
      </div>

      <div className="controlsGroup">
        <label>To</label>
        <input value={props.to} onChange={(e) => props.setTo(e.target.value)} />
      </div>

      <div className="controlsGroup">
        <label>Rows</label>
        <select
          value={props.limit}
          onChange={(e) => props.setLimit(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="controlsButtons">
        <button onClick={props.onApply}>Apply</button>
        <button onClick={props.onClear}>Clear</button>
      </div>
    </div>
  );
}
