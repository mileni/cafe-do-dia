// frontend/src/forms/CoffeeForm.jsx
import React from 'react';
import "react-datepicker/dist/react-datepicker.css";

// Importando o Custom Hook de lógica
//import useCoffeeFormLogic from '../hooks/useCoffeeFormLogic';
import useCoffeeFormLogic from '../hooks/useCoffeeFormLogic';

// Importando os submódulos de UI
import BasicInfo from './CoffeeForm/BasicInfo';
import SelectFields from './CoffeeForm/SelectFields';
import RatingInput from './CoffeeForm/RatingInput';
import ImageUpload from './CoffeeForm/ImageUpload';
import DateInputs from './CoffeeForm/DateInputs';
import RoasterInfo from './CoffeeForm/RoasterInfo';
import CoffeeGrindRange from './CoffeeForm/CoffeeGrindRange';
import PurchaseInfo from './CoffeeForm/PurchaseInfo';

const CoffeeForm = React.forwardRef(({ onSubmit, initialData = {} }, ref) => {
  
  // Toda a lógica é extraída para o custom hook
  const {
    register,
    handleSubmit,
    control, 
    errors,
    setValue, 
    watch,
    grindValue,
    setGrindValue,
    imagePreview,
    setImagePreview,
    dataLists,

    // Itens para o RoasterInfo
    textareaRef,
    roasterDescription,
    adjustHeight,
    
    // NOVO: Itens para o DateInputs (Observações)
    observationTextareaRef,
    adjustObservationHeight,
    coffeeObservationValue,  // Caso queira usar o valor da observação
    
  } = useCoffeeFormLogic(initialData, onSubmit);

  return (
    <form ref={ref} onSubmit={handleSubmit()} className="space-y-4 mr-2">
      <BasicInfo 
        register={register} 
        errors={errors}
        control={control} // Passando o control para BasicInfo
      />

      <SelectFields 
        register={register} 
        dataLists={dataLists} 
      />
      
      {/* Passando setValue, watch e os itens do hook para RoasterInfo */}
      <RoasterInfo
        register={register}
        errors={errors}
        setValue={setValue} 
        watch={watch}
        textareaRef={textareaRef}
        roasterDescription={roasterDescription}
        adjustHeight={adjustHeight}
        control={control} // Passando o control para RoasterInfo (se precisar)
      />

      <div className="columns-2 gap-8">
        <RatingInput name="coffeeAcidity" control={control} label="Acidez" />
        <RatingInput name="coffeeSweetness" control={control} label="Doçura" />
        <RatingInput name="coffeeFullBodied" control={control} label="Corpo" />
        <RatingInput name="coffeeBitterness" control={control} label="Amargor" />
      </div>

      <ImageUpload 
        register={register} 
        initialData={initialData}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
      />
      
      <hr />
      
      {/* Slider de moagem separado */}
			<div className="hidden">
				<CoffeeGrindRange
					grindValue={grindValue}
					setGrindValue={setGrindValue}
					register={register}
				/>
			</div>
    
			<DateInputs control={control} />

			<PurchaseInfo 
				register={register}
				control={control}
				observationTextareaRef={observationTextareaRef}
				adjustObservationHeight={adjustObservationHeight}
			/>
      
    </form>
  );
});

export default CoffeeForm;
