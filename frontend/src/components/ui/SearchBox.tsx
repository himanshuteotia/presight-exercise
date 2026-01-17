import "./ui.css";
type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBox({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Search by first or last name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="search-box"
    />
  );
}
