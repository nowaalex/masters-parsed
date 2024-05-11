import { memo } from "react";
import type { ComponentPropsWithoutRef } from "react";

export interface Bonus {
  /** bonus for set won */
  set: number;
  /** bonus for first place */
  first: number;
  /** bonus for second place */
  second: number;
}

const FIELDS = [
  ["set", "Set bonus"],
  ["first", "1 bonus"],
  ["second", "2 bonus"],
] as const satisfies [keyof Bonus, string][];

interface Props extends ComponentPropsWithoutRef<"form"> {}

const BonusForm = (props: Props) => (
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
