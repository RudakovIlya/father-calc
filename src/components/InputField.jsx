import React from "react";

const InputField = React.memo(
  ({
    label,
    name,
    value,
    placeholder,
    onChange,
    inputMode = "decimal",
    onFocus,
    tabIndex,
  }) => {
    return (
      <div>
        <label className="block text-lg font-semibold text-gray-200 mb-2">
          {label}
        </label>
        <input
          type="text"
          inputMode={inputMode}
          tabIndex={tabIndex}
          pattern="[0-9]*"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-100 text-xl placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
          name={name}
        />
      </div>
    );
  }
);

export default InputField;
