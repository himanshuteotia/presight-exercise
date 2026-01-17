import "./people.css";
import type { Person } from "../../../../shared/types/person";

function PersonCard({ person }: { person: Person }) {
  return (
    <div className="card">
      <img
        src={person.avatar}
        className="avatar"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/avatar-placeholder.png";
        }}
      />

      <div className="card-content">
        <div className="name">
          {person.first_name} {person.last_name}
        </div>

        <div className="meta">
          {person.nationality} • {person.age} yrs
        </div>

        <div className="hobbies">
          {person.hobbies.slice(0, 2).join(", ")}
          {person.hobbies.length > 2 && (
            <span className="more">
              {" "}
              (+{person.hobbies.length - 2})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonCard;
