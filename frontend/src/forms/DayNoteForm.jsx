// frontend/src/forms/DayNoteForm.jsx
import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// 🔹 Função auxiliar para criar Date sem deslocamento de fuso horário
const parseDateWithoutTimezone = (dateStr) => {
  if (!dateStr) return new Date();
  const [day, month, year] = dateStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day)); // evita UTC
};

const DayNoteForm = forwardRef(({ onSubmit, dayNoteToEdit }, ref) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      noteDate: dayNoteToEdit?.noteDate
        ? parseDateWithoutTimezone(dayNoteToEdit.noteDate)
        : new Date(),
      noteText: dayNoteToEdit?.noteText || '',
    },
  });

  useEffect(() => {
    if (dayNoteToEdit) {
      reset({
        noteDate: parseDateWithoutTimezone(dayNoteToEdit.noteDate),
        noteText: dayNoteToEdit.noteText || '',
      });
    } else {
      reset({
        noteDate: new Date(),
        noteText: '',
      });
    }
  }, [dayNoteToEdit, reset]);

  // 🔹 Expor submit para o parent modal poder chamar
  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
  }));

  const noteText = watch('noteText');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      {/* Campo de Data */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="noteDate"
        >
          Data
        </label>
        <DatePicker
          id="noteDate"
          selected={watch('noteDate')}
          onChange={(date) => setValue('noteDate', date)}
          className="w-full rounded border border-gray-300 px-3 py-2 text-xs focus:outline-none"
          dateFormat="dd/MM/yyyy"
          locale="pt-BR"
        />
      </div>

      {/* Campo de Texto */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="noteText"
        >
          Nota
        </label>
        <textarea
          id="noteText"
          {...register('noteText', { required: 'A nota é obrigatória' })}
          rows={6}
          className={`w-full rounded border px-3 py-2 focus:outline-none text-xs ${
            errors.noteText ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Digite sua nota aqui..."
          value={noteText}
          onChange={(e) => setValue('noteText', e.target.value)}
        />
        {errors.noteText && (
          <p className="text-red-500 text-xs mt-1">
            {errors.noteText.message}
          </p>
        )}
      </div>
    </form>
  );
});

export default DayNoteForm;
