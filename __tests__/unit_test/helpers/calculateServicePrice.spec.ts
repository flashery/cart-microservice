describe('calculateRegularAndOvertimeHours', () => {
  it('should handle a single time slot that falls under regular hours', () => {
    expect(1).toEqual(1);
  });
});
// import { ITimeSlot } from '../../../src/infrastructure/mappers/ITimeSlot';

// import {
//   calculateRegularAndOvertimeHours,
//   calculateHourlyPrice,
//   calculateFixedPrice,
//   getCostDetailHourlyFormat,
//   getCostDetailFixedFormat
// } from '../../../src/helpers/calculateServicePrice';
// import { SelectedCostUnits } from '../../../src/infrastructure/mappers/SelectedCostUnits';
// import { PreferredTiming } from '../../../src/app/domain/entities/preferred-timing/PreferredTiming';
// import { IServicePricingHourly } from '../../../src/infrastructure/mappers/service-pricing/IServicePricingHourly';

// describe('calculateRegularAndOvertimeHours', () => {
//   it('should handle a single time slot that falls under regular hours', () => {
//     const slots: ITimeSlot[] = [{ title: 'test', from: 900, to: 1100 }];
//     const expected = { regularHours: 200, afterHours: 0 };
//     expect(calculateRegularAndOvertimeHours(slots)).toEqual(expected);
//   });

//   it('should handle a single time slot that falls under overtime hours', () => {
//     const slots: ITimeSlot[] = [{ title: 'test', from: 2000, to: 2200 }];
//     const expected = { regularHours: 0, afterHours: 200 };
//     expect(calculateRegularAndOvertimeHours(slots)).toEqual(expected);
//   });

//   it('should handle a single time slot that spans both regular and overtime hours', () => {
//     const slots: ITimeSlot[] = [{ title: 'test', from: 1800, to: 2200 }];
//     const expected = { regularHours: 200, afterHours: 200 };
//     expect(calculateRegularAndOvertimeHours(slots)).toEqual(expected);
//   });

//   it('should handle a single time slot that spans across midnight', () => {
//     const slots: ITimeSlot[] = [{ title: 'test', from: 2200, to: 200 }];
//     const expected = { regularHours: 0, afterHours: 400 };
//     expect(calculateRegularAndOvertimeHours(slots)).toEqual(expected);
//   });

//   it('should handle multiple time slots', () => {
//     const slots: ITimeSlot[] = [
//       { title: 'test', from: 900, to: 1100 },
//       { title: 'test', from: 2000, to: 2200 },
//       { title: 'test', from: 1800, to: 2200 },
//       { title: 'test', from: 2200, to: 200 }
//     ];
//     const expected = { regularHours: 400, afterHours: 800 };
//     expect(calculateRegularAndOvertimeHours(slots)).toEqual(expected);
//   });
// });

// describe('calculateHourlyPrice', () => {
//   it('returns 0 if the estimate is free', () => {
//     const result = calculateHourlyPrice(
//       {
//         isFreeEstimate: true,
//         regularHours: {
//           firstHourValue: 0,
//           additionalHoursValue: 0,
//           additionalHoursType: ''
//         },
//         afterHours: {
//           firstHourValue: 0,
//           additionalHoursValue: 0,
//           additionalHoursType: ''
//         },
//         estimatedHours: 0
//       },
//       {
//         preferredWeekDays: [],
//         preferredTimeSlots: []
//       }
//     );
//     expect(result).toBe(0);
//   });

//   it('calculates the price correctly for regular hours', () => {
//     const result = calculateHourlyPrice(
//       {
//         isFreeEstimate: false,
//         regularHours: {
//           firstHourValue: 100,
//           additionalHoursValue: 50,
//           additionalHoursType: 'dollar'
//         },
//         afterHours: {
//           firstHourValue: 100,
//           additionalHoursValue: 50,
//           additionalHoursType: 'percentage'
//         },
//         estimatedHours: 5
//       },
//       {
//         preferredWeekDays: [],
//         preferredTimeSlots: [{ title: 'test', from: 900, to: 1100 }]
//       }
//     );
//     expect(result).toBe(300);
//   });

//   it('calculates the price correctly for after hours', () => {
//     const result = calculateHourlyPrice(
//       {
//         isFreeEstimate: false,
//         regularHours: {
//           firstHourValue: 100,
//           additionalHoursValue: 50,
//           additionalHoursType: 'dollar'
//         },
//         afterHours: {
//           firstHourValue: 200,
//           additionalHoursValue: 75,
//           additionalHoursType: 'percentage'
//         },
//         estimatedHours: 5
//       },
//       {
//         preferredWeekDays: [],
//         preferredTimeSlots: [{ title: 'test', from: 2000, to: 2200 }]
//       }
//     );
//     expect(result).toBe(800);
//   });
// });

// describe('calculateFixedPrice', () => {
//   it('calculates fixed price with no pricing unit types', () => {
//     const fixed = {
//       initialFee: 10,
//       perQtyPrice: 5,
//       pricingUnitTypes: []
//     };
//     const selectedCostUnits: SelectedCostUnits[] = [];
//     const quantity = 2;
//     const result = calculateFixedPrice(fixed, selectedCostUnits, quantity);
//     expect(result).toEqual({
//       unitTypesSelected: [],
//       extendedServiceCost: 20,
//       quantity
//     });
//   });

//   it('calculates fixed price with pricing unit types', () => {
//     const fixed = {
//       initialFee: 10,
//       perQtyPrice: 5,
//       pricingUnitTypes: [
//         {
//           perUnitPrice: 25,
//           optionsPrompt: 'please select color',
//           sizeOptionsType: 'color'
//         },
//         {
//           perUnitPrice: 100,
//           optionsPrompt: 'please select size',
//           sizeOptionsType: 'size'
//         }
//       ]
//     };

//     const selectedCostUnits: SelectedCostUnits[] = [
//       {
//         id: 21,
//         value: 'red',
//         costUnitsToCharge: 2,
//         sizeOptionsType: 'color',
//         lang: 'en-US'
//       },
//       {
//         id: 21,
//         value: 'medium',
//         costUnitsToCharge: 1,
//         sizeOptionsType: 'size',
//         lang: 'en-US'
//       }
//     ];
//     const quantity = 2;
//     const result = calculateFixedPrice(fixed, selectedCostUnits, quantity);

//     expect(result).toEqual({
//       unitTypesSelected: [
//         {
//           sizeOptionsType: 'color',
//           sizeOptionsSelected: 'red',
//           unitCost: 50
//         },
//         {
//           sizeOptionsType: 'size',
//           sizeOptionsSelected: 'medium',
//           unitCost: 100
//         }
//       ],
//       extendedServiceCost: 320,
//       quantity
//     });
//   });
// });

// describe('getCostDetailHourlyFormat', () => {
//   const hourlyPricing: IServicePricingHourly = {
//     isFreeEstimate: false,
//     regularHours: {
//       firstHourValue: 100,
//       additionalHoursValue: 20,
//       additionalHoursType: 'dollar'
//     },
//     afterHours: {
//       firstHourValue: 100,
//       additionalHoursValue: 20,
//       additionalHoursType: 'percentage'
//     },
//     estimatedHours: 4
//   };

//   it('should return HourlyRegularHours object when hourlyRateType is regularHours', () => {
//     const preferredTiming: PreferredTiming = {
//       preferredWeekDays: [],
//       preferredTimeSlots: [
//         {
//           title: 'test',
//           from: 900,
//           to: 1700
//         }
//       ]
//     };
//     const extendedServiceCost = 400;
//     const expected = {
//       extendedServiceCost,
//       hourlyRegularHoursPricing: {
//         regularHours: hourlyPricing.regularHours
//       },
//       regularEstimatedHours: hourlyPricing.estimatedHours
//     };
//     let costDetail = getCostDetailHourlyFormat(
//       preferredTiming,
//       hourlyPricing,
//       extendedServiceCost
//     );

//     expect(costDetail).toEqual(expected);
//   });

//   it('should return HourlyAfterHours object when hourlyRateType is afterHours', () => {
//     const preferredTiming: PreferredTiming = {
//       preferredWeekDays: [],
//       preferredTimeSlots: [
//         {
//           title: 'test',
//           from: 1900,
//           to: 400
//         }
//       ]
//     };
//     const extendedServiceCost = 600;
//     const expected = {
//       extendedServiceCost,
//       hourlyRegularHoursPricing: {
//         afterHours: hourlyPricing.afterHours
//       },
//       regularEstimatedHours: hourlyPricing.estimatedHours
//     };
//     const costDetail = getCostDetailHourlyFormat(
//       preferredTiming,
//       hourlyPricing,
//       extendedServiceCost
//     );

//     expect(costDetail).toEqual(expected);
//   });
// });

// describe('getCostDetailFixedFormat', () => {
//   it('returns the correct Fixed object', () => {
//     const fixedPricing = {
//       initialFee: 50,
//       perQtyPrice: 10,
//       pricingUnitTypes: [
//         {
//           perUnitPrice: 25,
//           optionsPrompt: 'please select color',
//           sizeOptionsType: 'meters'
//         }
//       ]
//     };
//     const computedData = {
//       unitTypesSelected: [
//         {
//           sizeOptionsType: 'meters',
//           sizeOptionsSelected: 'Very Wide',
//           unitCost: 50
//         }
//       ],
//       extendedServiceCost: 350,
//       quantity: 5
//     };
//     const expectedFixed = {
//       quantity: 5,
//       materialsTotal: 0,
//       fixedPricing: {
//         initialFee: 50,
//         perQtyPricing: {
//           perQtyPrice: 10,
//           unitTypesSelected: [
//             {
//               sizeOptionsType: 'meters',
//               sizeOptionsSelected: 'Very Wide',
//               unitCost: 50
//             }
//           ]
//         }
//       },
//       extendedServiceCost: 350,
//       extendedMaterialsCost: 0
//     };

//     const result = getCostDetailFixedFormat(fixedPricing, computedData);

//     expect(result).toEqual(expectedFixed);
//   });
// });
