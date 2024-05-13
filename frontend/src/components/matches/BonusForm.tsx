import { memo } from "react";
import type { ComponentPropsWithoutRef } from "react";
import type { Bonus } from "types";

const FIELDS = [
  ["set", "Set bonus"],
  ["first", "1 bonus"],
  ["second", "2 bonus"],
] as const satisfies [keyof Bonus, string][];

const BonusForm = (props: ComponentPropsWithoutRef<"form">) => (
  <form {...props}>
    {FIELDS.map(([name, label]) => (
      <label className="grid flex-auto" key={name}>
        {label}
        <input
          required
          name={name}
          type="number"
          defaultValue={0}
          min="0"
          max="9999"
          className="min-w-[4ch]"
        />
      </label>
    ))}
  </form>
);

export default memo(BonusForm);
