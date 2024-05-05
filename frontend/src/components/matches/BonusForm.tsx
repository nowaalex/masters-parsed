import { memo } from "react";
import type { ComponentPropsWithoutRef } from "react";

interface DefaultValues {
  setBonus: number;
  firstBonus: number;
  secondBonus: number;
}

interface Props extends ComponentPropsWithoutRef<"form"> {
  defaultValues: DefaultValues;
}

const BonusForm = ({ defaultValues, ...props }: Props) => (
  <form {...props}>
    <label className="grid">
      Set bonus
      <input
        required
        name="setBonus"
        type="number"
        defaultValue={defaultValues.setBonus}
        min="0"
        max="10000"
      />
    </label>
    <label className="grid">
      First bonus
      <input
        required
        name="firstBonus"
        defaultValue={defaultValues.firstBonus}
        type="number"
        min="0"
        max="10000"
      />
    </label>
    <label className="grid">
      Second bonus
      <input
        required
        name="secondBonus"
        defaultValue={defaultValues.secondBonus}
        type="number"
        min="0"
        max="10000"
      />
    </label>
  </form>
);

export default memo(BonusForm);
