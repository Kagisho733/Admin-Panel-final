import type { UserRole } from "../../types/User";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const roles: UserRole[] = [
  "customer",
  "admin",
  "manager",
  "seller",
  "supplier",
  "driver",
  "support",
];

export default function UserRoleFilter({
  value,
  onChange,
}: Props) {

  return (

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        rounded-xl
        border
        px-4
        py-3
        focus:border-blue-500
        focus:outline-none
      "
    >

      <option value="">
        All Roles
      </option>

      {roles.map((role) => (

        <option
          key={role}
          value={role}
        >
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </option>

      ))}

    </select>

  );

}