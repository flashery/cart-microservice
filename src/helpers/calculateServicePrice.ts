import { Fixed } from '../app/domain/entities/cost-detail/Fixed';
import { HourlyAfterHours } from '../app/domain/entities/cost-detail/HourlyAfterHours';
import { HourlyRegularHours } from '../app/domain/entities/cost-detail/HourlyRegularHours';
import { PreferredTiming } from '../app/domain/entities/preferred-timing/PreferredTiming';
import { ICostDetailRequestObj } from '../infrastructure/mappers/ICostDetailRequestObj';
import { IPreferredTiming } from '../infrastructure/mappers/IPreferredTiming';
import { ITimeSlot } from '../infrastructure/mappers/ITimeSlot';
import { SelectedCostUnits } from '../infrastructure/mappers/SelectedCostUnits';
import { IUnitTypesSelected } from '../infrastructure/mappers/cost-detail/IUnitTypesSelected';
import { IHourlyRate } from '../infrastructure/mappers/service-pricing/IHourlyRate';
import { IPricingUnitType } from '../infrastructure/mappers/service-pricing/IPricingUnitType';
import { IServicePricingFixed } from '../infrastructure/mappers/service-pricing/IServicePricingFixed';
import { IServicePricingHourly } from '../infrastructure/mappers/service-pricing/IServicePricingHourly';
import { IservicePricing } from '../infrastructure/mappers/service-pricing/IservicePricing';
import { roundTwoDecimals, add, mutiply } from './mathHelper';
interface CalculatedFixedData {
  unitTypesSelected: IUnitTypesSelected[];
  extendedServiceCost: number;
  quantity: number;
}

/**
 * Calculates regular and overtime hours based on an array of time slots.
 *
 * @param {ITimeSlot[]} slots - An array of time slots with `from` and `to` properties.
 * @return {{regularHours: number, afterHours: number}} An object with the calculated regular and overtime hours.
 */
export function calculateRegularAndOvertimeHours(slots: ITimeSlot[]): {
  regularHours: number;
  afterHours: number;
} {
  const REGULAR_RATE_START_TIME = 800;
  const REGULAR_RATE_END_TIME = 2000;

  // Initialize regular and overtime hours to zero
  let regularHours = 0;
  let afterHours = 0;

  // Iterate over each time slot
  slots.forEach(({ from: slotFrom, to: slotTo }) => {
    // If the end time is earlier than the start time, add 24 hours to the end time
    slotTo = slotTo < slotFrom ? slotTo + 2400 : slotTo;

    // Determine whether the time slot falls under regular or overtime hours
    if (
      slotFrom >= REGULAR_RATE_END_TIME ||
      slotTo <= REGULAR_RATE_START_TIME
    ) {
      // Entire time slot falls under overtime hours
      afterHours += slotTo - slotFrom;
    } else if (
      slotFrom < REGULAR_RATE_START_TIME &&
      slotTo <= REGULAR_RATE_END_TIME
    ) {
      // Time slot spans both regular and overtime hours
      afterHours += REGULAR_RATE_START_TIME - slotFrom;
      regularHours += slotTo - REGULAR_RATE_START_TIME;
    } else if (
      slotFrom >= REGULAR_RATE_START_TIME &&
      slotTo > REGULAR_RATE_END_TIME
    ) {
      // Time slot spans both regular and overtime hours
      regularHours += REGULAR_RATE_END_TIME - slotFrom;
      afterHours += slotTo - REGULAR_RATE_END_TIME;
    } else {
      // Entire time slot falls under regular hours
      regularHours += slotTo - slotFrom;
    }
  });

  // Return the calculated regular and overtime hours
  return { regularHours, afterHours };
}

/**
 * Returns the hourly rate type based on the preferred timing.
 *
 * @param {IPreferredTiming} preferredTiming - Object containing preferred time slots.
 * @return {string} The hourly rate type: 'regularHours' or 'afterHours'.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getHourlyRateType(preferredTiming: IPreferredTiming): string {
  // Destructure the preferredTimeSlots object from the preferredTiming parameter
  const { preferredTimeSlots } = preferredTiming;

  // Calculate the regular and overtime hours based on the preferred time slots
  const { regularHours, afterHours } =
    calculateRegularAndOvertimeHours(preferredTimeSlots);

  // Return the hourly rate type based on the calculated regular and overtime hours
  return regularHours >= afterHours ? 'regularHours' : 'afterHours';
}

/**
 * Calculates the hourly price for a service based on the provided hourly pricing and preferred timing.
 *
 * @param {IServicePricingHourly} hourlyPricing - An object containing hourly pricing information, including whether or not the estimate is free, regular hours pricing, after-hours pricing, and the estimated hours required for the service.
 * @param {IPreferredTiming} preferedTiming - An object containing the preferred timing for the service, including whether it should be scheduled during regular hours or after hours.
 * @return {number} The calculated hourly price for the service.
 */
export function calculateHourlyPrice(
  quantity: number,
  hourlyPricing: IServicePricingHourly,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preferedTiming: IPreferredTiming
): number {
  // Extract pricing information from the hourlyPricing object
  // const { isFreeEstimate, regularHours, afterHours, estimatedHours } =
  //   hourlyPricing;

  // const { isFreeEstimate, regularHours, afterHours } = hourlyPricing;

  // If the estimate is free, return 0
  // if (isFreeEstimate) return 0;

  // Determine the appropriate hourly rate based on the preferred timing
  // const hourlyRateType = getHourlyRateType(preferedTiming);

  // let hourlyRate: IHourlyRate =
  //   hourlyRateType === 'regularHours' ? regularHours : afterHours;

  // Extract the relevant hourly rate values from the hourlyRate object

  // const { firstHourValue, additionalHoursValue, additionalHoursType } =
  //   hourlyRate;

  const hourlyRate = hourlyPricing.regularHours;
  const { firstHourValue } = hourlyRate;

  // Calculate the hourly price based on the estimated hours and hourly rate
  let retVal = mutiply(quantity, firstHourValue);

  // for (let i = estimatedHours - 1; i > 0; i -= 1) {
  //   if (additionalHoursType === 'percentage') {
  //     // If additionalHoursType is percentage, calculate the value as a percentage of the first hour value
  //     retVal += mutiply(divide(additionalHoursValue, 100), firstHourValue);
  //   } else {
  //     // If additionalHoursType is flat, add the additionalHoursValue to the hourly price
  //     retVal += additionalHoursValue;
  //   }
  // }

  return roundTwoDecimals(retVal);
}

/**
 * Calculates the fixed price of a service based on the provided pricing information, selected cost units,
 * and quantity.
 *
 * If pricingUnitTypes is null, only the initialFee and perQtyPrice are used to calculate
 * the extendedServiceCost. Otherwise, the function iterates over the pricingUnitTypes to calculate the
 * unit cost for each sizeOptionsType and adds up the total unit cost to calculate the extendedServiceCost.
 *
 * @param {IServicePricingFixed} fixed - the pricing information for the service
 * @param {ICostUnitDictionary[]} selectedCostUnits - the selected cost units for the service
 * @param {number} quantity - the quantity of the service being purchased
 * @return {CalculatedFixedData} the calculated fixed price of the service
 */
export function calculateFixedPrice(
  fixed: IServicePricingFixed,
  selectedCostUnits: SelectedCostUnits[],
  quantity: number
): CalculatedFixedData {
  // Destructure pricing information from fixed parameter
  const { initialFee = 0, perQtyPrice = 0, pricingUnitTypes = 0 } = fixed;

  // If there are no pricingUnitTypes, calculate the extended service cost using only the initialFee and perQtyPrice
  if (!pricingUnitTypes)
    return {
      unitTypesSelected: [],
      extendedServiceCost: roundTwoDecimals(
        add(initialFee, mutiply(quantity, perQtyPrice))
      ),
      quantity
    };

  // Create an array to hold the selected unit types
  const unitTypesSelected: IUnitTypesSelected[] = [];

  // Iterate over pricingUnitTypes to calculate the unit cost for each sizeOptionsType
  selectedCostUnits.forEach((selectedCostUnit: SelectedCostUnits) => {
    // Find the selected cost unit for the current pricingUnitType
    const pricingUnitType: IPricingUnitType | undefined = pricingUnitTypes.find(
      (item: IPricingUnitType) =>
        item.sizeOptionsType === selectedCostUnit.sizeOptionsType
    );

    // If no cost unit was found for the current pricingUnitType, skip to the next pricingUnitType
    if (!pricingUnitType) return;

    // Get the number of cost units to charge for the selected cost unit
    const costUnitsToCharge: number = selectedCostUnit.costUnitsToCharge;

    // Calculate the unit cost for the current pricingUnitType
    const unitCost = mutiply(pricingUnitType.perUnitPrice, costUnitsToCharge);

    // Add the selected unit type to the array
    unitTypesSelected.push({
      sizeOptionsType: pricingUnitType.sizeOptionsType,
      sizeOptionsSelected: selectedCostUnit.value,
      unitCost
    });
  });

  // Calculate the total unit cost by summing the unit costs for each selected unit type
  let totalUnitCost = 0;
  unitTypesSelected.forEach((item) => {
    totalUnitCost += item.unitCost;
  });

  // Calculate the extended service cost using the initialFee, perQtyPrice, and totalUnitCost
  return {
    unitTypesSelected,
    extendedServiceCost: roundTwoDecimals(
      add(initialFee, mutiply(quantity, add(perQtyPrice, totalUnitCost)))
    ),
    quantity
  };
}

/**
 * Returns either HourlyAfterHours or HourlyRegularHours depending on the preferred timing.
 *
 * @param {IPreferredTiming} preferredTiming - the preferred timing object
 * @param {IServicePricingHourly} hourlyPricing - the hourly pricing object
 * @param {number} extendedServiceCost - the extended cost
 * @return {HourlyAfterHours | HourlyRegularHours} the hourly pricing object with the extended cost
 */
export function getCostDetailHourlyFormat(
  preferredTiming: IPreferredTiming,
  hourlyPricing: IServicePricingHourly,
  extendedServiceCost: number
): HourlyAfterHours | HourlyRegularHours {
  // Determine whether the preferred timing is for regular or after hours
  // const hourlyRateType = getHourlyRateType(preferredTiming);

  // if (hourlyRateType === 'regularHours') {
  // If the preferred timing is for regular hours, return the hourly pricing object with the regular hours rate
  const regularHoursRate: IHourlyRate = hourlyPricing.regularHours;

  return {
    extendedServiceCost,
    hourlyRegularHoursPricing: {
      regularHours: regularHoursRate
    },
    regularEstimatedHours: hourlyPricing.estimatedHours
  };
  // }

  // Otherwise, return the hourly pricing object with the after hours rate
  // const afterHoursRate: IHourlyRate = hourlyPricing.afterHours;

  // return {
  //   extendedServiceCost,
  //   hourlyRegularHoursPricing: {
  //     afterHours: afterHoursRate
  //   },
  //   regularEstimatedHours: hourlyPricing.estimatedHours
  // };
}

/**
 * Returns a Fixed object with details about the cost of a fixed pricing item.
 * @param fixedPricing - An object containing the initial fee and per-quantity price.
 * @param computedData - An object containing calculated data about the fixed pricing item.
 * @returns A Fixed object with quantity, materialsTotal, fixedPricing, extendedServiceCost, and extendedMaterialsCost properties.
 */
export function getCostDetailFixedFormat(
  fixedPricing: IServicePricingFixed,
  computedData: CalculatedFixedData
): Fixed {
  const { initialFee, perQtyPrice } = fixedPricing;
  const {
    unitTypesSelected,
    quantity,
    extendedServiceCost
  }: CalculatedFixedData = computedData;

  return {
    quantity,
    materialsTotal: 0, // Calculation will be added ownw MaterialsCost calculation
    fixedPricing: {
      initialFee,
      perQtyPricing: {
        perQtyPrice,
        unitTypesSelected
      }
    },
    extendedServiceCost: extendedServiceCost,
    extendedMaterialsCost: 0 // Calculation will be added ownw MaterialsCost calculation
  };
}

function getDefault(
  quantity: number,
  fixlersServiceMarkupPct: number | undefined,
  fixlersMaterialMarkupPct: number | undefined,
  isCustomQuoteJob: boolean | undefined
): Fixed {
  return {
    quantity,
    materialsTotal: 0,
    fixedPricing: {
      initialFee: 0,
      perQtyPricing: {
        perQtyPrice: 0,
        unitTypesSelected: []
      }
    },
    extendedServiceCost: 0,
    extendedMaterialsCost: 0,
    fixlersServiceMarkupPct,
    fixlersMaterialMarkupPct,
    isCustomQuoteJob
  } as Fixed;
}

/**
 * Calculates the cost detail for a given service pricing, preferred timing, and cost detail request object.
 * @param pricing - The service pricing object.
 * @param preferedTiming - The user's preferred timing for the service.
 * @param data - The cost detail request object containing the selected cost units and quantity.
 * @returns Either a Fixed, HourlyAfterHours, or HourlyRegularHours cost detail format.
 */
export default (
  pricing: IservicePricing,
  preferedTiming: PreferredTiming,
  data: ICostDetailRequestObj,
  quantity: number,
  costDetail: Fixed | HourlyAfterHours | HourlyRegularHours
): Fixed | HourlyAfterHours | HourlyRegularHours => {
  //Check if custom job
  if (
    costDetail?.isCustomQuoteJob === undefined ||
    costDetail?.isCustomQuoteJob === true
  )
    return getDefault(
      quantity,
      costDetail?.fixlersServiceMarkupPct,
      costDetail?.fixlersMaterialMarkupPct,
      costDetail?.isCustomQuoteJob
    );

  const hourlyPricing = pricing?.hourly
    ? (pricing?.hourly as IServicePricingHourly)
    : null;
  const fixedPricing = pricing?.fixed
    ? (pricing?.fixed as IServicePricingFixed)
    : null;

  const { selectedCostUnits } = data;

  if (hourlyPricing && !fixedPricing) {
    // Calculate hourly price and return hourly cost detail format.
    const extendedServiceCost = calculateHourlyPrice(
      quantity,
      hourlyPricing,
      preferedTiming
    );
    const calcData = getCostDetailHourlyFormat(
      preferedTiming,
      hourlyPricing,
      extendedServiceCost
    );

    return {
      ...calcData,
      isCustomQuoteJob: costDetail?.isCustomQuoteJob,
      quantity,
      fixlersServiceMarkupPct: costDetail?.fixlersServiceMarkupPct,
      fixlersMaterialMarkupPct: costDetail?.fixlersMaterialMarkupPct
    };
  }

  if (fixedPricing && !hourlyPricing) {
    // Calculate fixed price and return fixed cost detail format.
    const calculatedData = calculateFixedPrice(
      fixedPricing,
      selectedCostUnits,
      quantity
    );

    const calcData = getCostDetailFixedFormat(fixedPricing, calculatedData);

    return {
      ...calcData,
      isCustomQuoteJob: costDetail?.isCustomQuoteJob,
      fixlersServiceMarkupPct: costDetail?.fixlersServiceMarkupPct,
      fixlersMaterialMarkupPct: costDetail?.fixlersMaterialMarkupPct
    };
  }

  return getDefault(
    quantity,
    costDetail?.fixlersServiceMarkupPct,
    costDetail?.fixlersMaterialMarkupPct,
    costDetail?.isCustomQuoteJob
  );
};
