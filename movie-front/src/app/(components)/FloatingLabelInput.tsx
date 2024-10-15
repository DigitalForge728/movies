import React, { ChangeEvent, useState } from "react";

interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: string;
  placeholder: string;
  type: string;
  value: string;
  setValue: (value: string) => void;
  width?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  name,
  placeholder,
  type,
  value,
  setValue,
  width = "100%",
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  return (
    <div className={`relative pb-8 w-full`}>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        placeholder=""
        className={`peer placeholder-transparent input-colour rounded-md p-2 sm:m-0 px-2 transition-all duration-300 h-[45px] w-full`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        {...rest}
      />
      <label
        htmlFor={id}
        className={`absolute left-2 text-white-500 transition-all duration-300
          ${
            focused || value
              ? "text-base -top-7"
              : "text-base top-2 translate-y-1"
          }`}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
