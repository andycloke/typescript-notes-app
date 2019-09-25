import React, { useState, EventHandler, ChangeEvent, useEffect } from 'react';
import { Modal, Input, Checkbox } from 'antd';
import { Note, NoteStatus } from '../types';
import styled from 'styled-components';

export type FormValues = Pick<Note, 'text' | 'status'>;

interface IProps {
  isOpen: boolean;
  onSaveClick: (values: FormValues) => Promise<void>;
  onCancelClick: () => void;
  initialValues: FormValues;
}

const TEXT_AREA_ROWS = 4;

const NoteModal = ({ isOpen, onSaveClick, onCancelClick, initialValues }: IProps) => {
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [textValue, setTextValue] = useState(initialValues.text);
  const [published, setPublished] = useState(initialValues.status === NoteStatus.PUBLISHED);

  useEffect(() => {
    /* potentially a bit of an anti pattern - initiaaly setting, then updating state of props, 
    but not unheard of, e.g. Formik's `enableReinitialize props allows you to do this */
    if (initialValues.text) {
      setTextValue(initialValues.text);
    }
    setPublished(initialValues.status === NoteStatus.PUBLISHED);
  }, [initialValues]);

  const handleSaveClick = async () => {
    setSaveButtonDisabled(true);
    try {
      await onSaveClick({
        text: textValue,
        status: published ? NoteStatus.PUBLISHED : NoteStatus.DRAFT
      });
    } catch (error) {
      console.log('error: ', error);
    }
    resetState();
  };

  const resetState = () => {
    setSaveButtonDisabled(false);
    setTextValue('');
    setPublished(false);
  };

  const handleTextAreaChange: EventHandler<ChangeEvent<{ value: string }>> = e =>
    setTextValue(e.target.value);

  const handlePublishedClick = () => setPublished(published => !published);

  return (
    <Modal
      destroyOnClose={true}
      visible={isOpen}
      okText="Save"
      onOk={handleSaveClick}
      onCancel={onCancelClick}
      okButtonProps={{ disabled: saveButtonDisabled }}
    >
      <STextArea
        autoFocus
        rows={TEXT_AREA_ROWS}
        value={textValue}
        onChange={handleTextAreaChange}
      ></STextArea>
      <SCheckbox checked={published} onChange={handlePublishedClick}>
        Published
      </SCheckbox>
    </Modal>
  );
};

const STextArea = styled(Input.TextArea)`
  margin-top: 20px;
`;

const SCheckbox = styled(Checkbox)`
  margin-top: 20px;
`;

export default NoteModal;
