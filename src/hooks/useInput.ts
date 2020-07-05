import React, { useState } from "react";

const useInput = (initialValue: string) => {
    const [value, setValue] = useState<string>(initialValue);
    const onChange = (text: string) => {
        setValue(text);
    };
    return { value, onChange, setValue };
};
export default useInput;
