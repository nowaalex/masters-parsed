import { memo, useEffect, useReducer } from "react";
import type { MatchesEntryFrontend } from "common";

interface Props
  extends Pick<MatchesEntryFrontend, "timeStamp" | "error" | "queueSize"> {
  className?: string;
}

const reducer = () => Date.now();

const Timer = memo<Pick<Props, "timeStamp">>(({ timeStamp }) => {
  const [now, updateNow] = useReducer(reducer, null, reducer);

  useEffect(() => {
    let intervalId = setInterval(updateNow, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return timeStamp > 0 ? `${Math.round((now - timeStamp) / 1000) + "s"}` : "-";
});

const SystemInfo = ({ className, timeStamp, queueSize, error }: Props) => (
  <div className={className}>
    Cache&nbsp;age:&nbsp;
    <Timer timeStamp={timeStamp} />; Queue&nbsp;size:&nbsp;{queueSize};
    {error ? (
      <>
        {" "}
        Last&nbsp;error:&nbsp;
        {error}
      </>
    ) : null}
  </div>
);

export default memo(SystemInfo);
