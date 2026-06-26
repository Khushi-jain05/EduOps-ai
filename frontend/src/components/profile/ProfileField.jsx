export default function ProfileField({
  label,
  name,
  value,
  isEditing,
  handleChange,
}) {
  return (
    <div className="profile-field">

      <label>{label}</label>

      <input
        type="text"
        value={value || ""}
        readOnly={!isEditing}
        onChange={(e) =>
          handleChange(name, e.target.value)
        }
      />

    </div>
  );
}