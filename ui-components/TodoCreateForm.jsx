/* eslint-disable */
"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createTodo } from "./graphql/mutations";
const client = generateClient();
export default function TodoCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    content: "",
    done: false,
    priority: "",
    owner: "",
  };
  const [content, setContent] = React.useState(initialValues.content);
  const [done, setDone] = React.useState(initialValues.done);
  const [priority, setPriority] = React.useState(initialValues.priority);
  const [owner, setOwner] = React.useState(initialValues.owner);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setContent(initialValues.content);
    setDone(initialValues.done);
    setPriority(initialValues.priority);
    setOwner(initialValues.owner);
    setErrors({});
  };
  const validations = {
    content: [],
    done: [],
    priority: [],
    owner: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue,
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          content,
          done,
          priority,
          owner,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item),
                ),
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName]),
            );
            return promises;
          }, []),
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createTodo.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "TodoCreateForm")}
      {...rest}
    >
      <TextField
        label="Content"
        isRequired={false}
        isReadOnly={false}
        value={content}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              content: value,
              done,
              priority,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.content ?? value;
          }
          if (errors.content?.hasError) {
            runValidationTasks("content", value);
          }
          setContent(value);
        }}
        onBlur={() => runValidationTasks("content", content)}
        errorMessage={errors.content?.errorMessage}
        hasError={errors.content?.hasError}
        {...getOverrideProps(overrides, "content")}
      ></TextField>
      <SwitchField
        label="Done"
        defaultChecked={false}
        isDisabled={false}
        isChecked={done}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              content,
              done: value,
              priority,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.done ?? value;
          }
          if (errors.done?.hasError) {
            runValidationTasks("done", value);
          }
          setDone(value);
        }}
        onBlur={() => runValidationTasks("done", done)}
        errorMessage={errors.done?.errorMessage}
        hasError={errors.done?.hasError}
        {...getOverrideProps(overrides, "done")}
      ></SwitchField>
      <SelectField
        label="Priority"
        placeholder="Please select an option"
        isDisabled={false}
        value={priority}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              content,
              done,
              priority: value,
              owner,
            };
            const result = onChange(modelFields);
            value = result?.priority ?? value;
          }
          if (errors.priority?.hasError) {
            runValidationTasks("priority", value);
          }
          setPriority(value);
        }}
        onBlur={() => runValidationTasks("priority", priority)}
        errorMessage={errors.priority?.errorMessage}
        hasError={errors.priority?.hasError}
        {...getOverrideProps(overrides, "priority")}
      >
        <option
          children="Low"
          value="low"
          {...getOverrideProps(overrides, "priorityoption0")}
        ></option>
        <option
          children="Medium"
          value="medium"
          {...getOverrideProps(overrides, "priorityoption1")}
        ></option>
        <option
          children="High"
          value="high"
          {...getOverrideProps(overrides, "priorityoption2")}
        ></option>
      </SelectField>
      <TextField
        label="Owner"
        isRequired={false}
        isReadOnly={false}
        value={owner}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              content,
              done,
              priority,
              owner: value,
            };
            const result = onChange(modelFields);
            value = result?.owner ?? value;
          }
          if (errors.owner?.hasError) {
            runValidationTasks("owner", value);
          }
          setOwner(value);
        }}
        onBlur={() => runValidationTasks("owner", owner)}
        errorMessage={errors.owner?.errorMessage}
        hasError={errors.owner?.hasError}
        {...getOverrideProps(overrides, "owner")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
