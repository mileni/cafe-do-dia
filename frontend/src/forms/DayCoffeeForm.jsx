// frontend/src/forms/DayCoffeeForm.jsx
import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo
} from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

const DayCoffeeForm = forwardRef(({ coffees = [], onSubmit, dayCoffeeToEdit }, ref) => {
  const recipeRef = useRef(null);
  const observationRef = useRef(null);

  const methods = [
    'Espresso Machine MiiCoffee Apex V2',
    'Espresso Machine Oster Prima Latte II 19bar',
    'Hario V60',
		'Hario V60 Neo',
    'Hario Switch',
		'Aeropress',
    'Yuropress',
    'Espresso',
    'Pour Over Tradicional (Melitta)',
    'Chemex',
    'French Press (Prensa Francesa)',
    'Cafeteira Italiana (Moka Pot)',
    'Sifão (Syphon)',
    'Clever Dripper',
    'Koar',
    'Origami',
    'Kalita Wave',
    'Cafeteira Elétrica',
    'Flair',
    'Cafflano',
    'Cafeteira globinho',
    'Cafeteira Eva Solo',
    'Café turco',
  ];

  // 🔹 Ordenação alfabética segura (sem mutar o array original)
  const sortedCoffees = useMemo(() => {
    return [...coffees].sort((a, b) =>
      `${a.coffeeRoaster} ${a.coffeeName}`
        .localeCompare(`${b.coffeeRoaster} ${b.coffeeName}`, 'pt-BR', {
          sensitivity: 'base'
        })
    );
  }, [coffees]);

  const parseBackendDate = (dateString) => {
    if (!dateString) return null;
    const parsed = parse(dateString, 'dd/MM/yyyy', new Date(), { locale: ptBR });
    return isValid(parsed) ? parsed : null;
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      coffeeId: '',
      dayDate: new Date(),
      dayMethod: methods[0],
      dayRecipe: '',
      dayGrind: '',
      dayObservation: '',
    },
  });

  // 🔹 Corrigindo registro duplo do textarea
  const {
    ref: recipeRegisterRef,
    ...recipeRest
  } = register('dayRecipe');

  const {
    ref: observationRegisterRef,
    ...observationRest
  } = register('dayObservation');

  const adjustTextareaHeight = (textarea) => {
    if (!textarea) return;
    textarea.style.height = 'auto';
    const minHeight = 3 * parseFloat(getComputedStyle(textarea).lineHeight);
    textarea.style.height = Math.max(textarea.scrollHeight, minHeight) + 'px';
  };

  const dayRecipeValue = watch('dayRecipe');
  const dayObservationValue = watch('dayObservation');

  useEffect(() => adjustTextareaHeight(recipeRef.current), [dayRecipeValue]);
  useEffect(() => adjustTextareaHeight(observationRef.current), [dayObservationValue]);

  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit)
  }));

  useEffect(() => {
    if (dayCoffeeToEdit) {
      const dateObject = parseBackendDate(dayCoffeeToEdit.dayDate);

      reset({
        coffeeId:
          dayCoffeeToEdit.coffee?.coffeeId ||
          dayCoffeeToEdit.coffeeId ||
          '',
        dayDate: dateObject || new Date(),
        dayMethod: dayCoffeeToEdit.dayMethod || methods[0],
        dayRecipe: dayCoffeeToEdit.dayRecipe || '',
        dayGrind: dayCoffeeToEdit.dayGrind || '',
        dayObservation: dayCoffeeToEdit.dayObservation || '',
      });
    } else {
      reset({
        coffeeId: '',
        dayDate: new Date(),
        dayMethod: methods[0],
        dayRecipe: '',
        dayGrind: '',
        dayObservation: '',
      });
    }
  }, [dayCoffeeToEdit, reset]);

  return (
    <form ref={ref} className="space-y-4">

      {/* Data */}
      <div>
        <label className="block text-gray-700 text-xs font-bold mb-2">
          Data do Café do Dia
        </label>

        <Controller
          name="dayDate"
          control={control}
          rules={{ required: 'A data do café do dia é obrigatória.' }}
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={field.onChange}
              dateFormat="dd/MM/yyyy"
              locale={ptBR}
              placeholderText="dd/mm/yyyy"
              className="appearance-none text-xs border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          )}
        />
        {errors.dayDate && (
          <p className="text-red-500 text-xs italic">
            {errors.dayDate.message}
          </p>
        )}
      </div>

      {/* Seleção de café */}
      <div>
        <label className="block text-gray-700 text-xs font-bold mb-2">
          Selecione o Café
        </label>

        <select
          {...register('coffeeId', { required: 'Selecione um café.' })}
          className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Selecione um café...</option>

          {sortedCoffees.map(coffee => (
            <option key={coffee.coffeeId} value={coffee.coffeeId}>
              {coffee.coffeeRoaster} - {coffee.coffeeName}
            </option>
          ))}
        </select>

        {errors.coffeeId && (
          <p className="text-red-500 text-xs italic">
            {errors.coffeeId.message}
          </p>
        )}
      </div>

      {/* Método */}
      <div>
        <label className="block text-gray-700 text-xs font-bold mb-2">
          Método de Preparo
        </label>

        <select
          {...register('dayMethod', { required: 'Selecione um método de preparo.' })}
          className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {methods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>

        {errors.dayMethod && (
          <p className="text-red-500 text-xs italic">
            {errors.dayMethod.message}
          </p>
        )}
      </div>

      {/* Receita */}
      <div>
        <label className="block text-gray-700 text-xs font-bold mb-2">
          Receita
        </label>

        <textarea
          {...recipeRest}
          rows={3}
          placeholder="Detalhes da receita..."
          className="appearance-none border text-xs rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none overflow-hidden"
          ref={(e) => {
            recipeRegisterRef(e);
            recipeRef.current = e;
          }}
        />
      </div>

      {/* Moagem */}
      <div>
        <label className="block text-gray-700 text-xs font-bold mb-2">
          Moagem
        </label>

        <input
          type="text"
          placeholder="Ex: Fina para espresso, Média para Hario V60"
          {...register('dayGrind')}
          className="appearance-none border text-xs rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Observação */}
      <div>
        <label className="block text-gray-700 text-xs font-bold mb-2">
          Observação
        </label>

        <textarea
          {...observationRest}
          rows={3}
          placeholder="Impressões gerais..."
          className="appearance-none border text-xs rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none overflow-hidden"
          ref={(e) => {
            observationRegisterRef(e);
            observationRef.current = e;
          }}
        />
      </div>

    </form>
  );
});

export default DayCoffeeForm;