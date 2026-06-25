export default function ProfileField({
  label,
  value,
}) {
  return (
    <div className="profile-field">

      <label>{label}</label>

      <input
        type="text"
        value={value}
        readOnly
      />

    </div>
  );
}