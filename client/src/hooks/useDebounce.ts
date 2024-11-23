import React, { useEffect, useState } from "react";

function useDebounce(onDebounce: (value: string) => void) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onDebounce(value);
    }, 500);

    return () => clearTimeout(timeout);
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }

  return { handleInputChange };
}

export default useDebounce;
