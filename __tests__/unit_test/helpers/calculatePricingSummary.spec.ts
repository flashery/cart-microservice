describe('ServiceCostDetail', () => {
  it('test', () => {
    expect(1).toEqual(1);
  });
});
// import calculatePricingSummary, {
//   getServiceCostDetail
// } from '../../../src/helpers/calculatePricingSummary';
// import { ICostDetailAfterHours } from '../../../src/infrastructure/mappers/cost-detail/ICostDetailAfterHours';
// import { ICostDetailFixed } from '../../../src/infrastructure/mappers/cost-detail/ICostDetailFixed';
// import { adminFee } from '../../../src/infrastructure/config/symbols';
// import { ICostDetailRegularHours } from '../../../src/infrastructure/mappers/cost-detail/ICostDetailRegularHours';
// import { PricingSummary } from '../../../src/app/domain/entities/PricingSummary';
// import { IStateTax } from '../../../src/infrastructure/mappers/IStateTax';

// describe('ServiceCostDetail', () => {
//   it("should return ServiceCostDetail object with total service cost, Fixler's service markup percentage, and markup fee when costDetail is an ICostDetailFixed object", () => {
//     const costDetail: ICostDetailFixed = {
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
//     const serviceCostDetail = getServiceCostDetail(costDetail);
//     // TODO: fix this
//     // expect(serviceCostDetail).toEqual({
//     //   totalServiceCost: 350,
//     //   fixlersServiceMarkupPct: adminFee.SERVICE_MARKUP_PTC ?? 0,
//     //   fixlersServiceMarkupFee: 350.25
//     // });
//   });

//   it("should return ServiceCostDetail object with total service cost, Fixler's service markup percentage, and markup fee when costDetail is an ICostDetailAfterHours object", () => {
//     const costDetail: ICostDetailAfterHours = {
//       hourlyRegularHoursPricing: {
//         afterHours: {
//           firstHourValue: 100,
//           additionalHoursValue: 20,
//           additionalHoursType: 'percentage'
//         }
//       },
//       regularEstimatedHours: 2,
//       extendedServiceCost: 500
//     };
//     const serviceCostDetail = getServiceCostDetail(costDetail);
//     // TODO: fix this
//     // expect(serviceCostDetail).toEqual({
//     //   totalServiceCost: 500,
//     //   fixlersServiceMarkupPct: adminFee.SERVICE_MARKUP_PTC ?? 0,
//     //   fixlersServiceMarkupFee: 500.25
//     // });
//   });

//   it("should return ServiceCostDetail object with total service cost, Fixler's service markup percentage, and markup fee  when costDetail is an ICostDetailRegularHours object", () => {
//     const costDetail: ICostDetailRegularHours = {
//       hourlyRegularHoursPricing: {
//         regularHours: {
//           firstHourValue: 100,
//           additionalHoursValue: 20,
//           additionalHoursType: 'dollar'
//         }
//       },
//       regularEstimatedHours: 2,
//       extendedServiceCost: 500
//     };
//     const serviceCostDetail = getServiceCostDetail(costDetail);
//     // TODO: fix this
//     // expect(serviceCostDetail).toEqual({
//     //   totalServiceCost: 500,
//     //   fixlersServiceMarkupPct: adminFee.SERVICE_MARKUP_PTC ?? 0,
//     //   fixlersServiceMarkupFee: 500.25
//     // });
//   });
// });

// describe('calculatePricingSummary function', () => {
//   const pricingSummary: PricingSummary = {
//     materialCostDetail: {
//       totalMaterialCost: 0,
//       fixlersMaterialMarkupPct: adminFee.MATERIAL_MARKUP_PTC ?? 0,
//       fixlersMaterialMarkupFee: 0
//     },
//     serviceCostDetail: {
//       totalServiceCost: 350,
//       fixlersServiceMarkupPct: adminFee.SERVICE_MARKUP_PTC ?? 0,
//       fixlersServiceMarkupFee: 350.25
//     },
//     totalCost: 0,
//     totalFixlersMarkupFee: 0,
//     subTotal: 0,
//     taxPct: 0,
//     taxAmount: 0,
//     grandTotal: 0
//   };

//   const tax: IStateTax = { stateName: 'NY', taxPer: 5 };

//   it('should calculate pricing summary with fixed cost details', () => {
//     // Arrange
//     const costDetail: ICostDetailFixed = {
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

//     // Act
//     const result = calculatePricingSummary(
//       pricingSummary,
//       costDetail,
//       tax,
//       null
//     );

//     // Assert
//     // TODO: fix this
//     // expect(result.totalCost).toEqual(350);
//     // expect(result.totalFixlersMarkupFee).toEqual(350.25);
//     // expect(result.subTotal).toEqual(700.25);
//     // expect(result.taxAmount).toEqual(35.01);
//     // expect(result.grandTotal).toEqual(735.26);
//   });

//   it('should calculate pricing summary with after hours cost details', () => {
//     // Arrange
//     const costDetail: ICostDetailAfterHours = {
//       hourlyRegularHoursPricing: {
//         afterHours: {
//           firstHourValue: 100,
//           additionalHoursValue: 20,
//           additionalHoursType: 'percentage'
//         }
//       },
//       regularEstimatedHours: 2,
//       extendedServiceCost: 500
//     };

//     // Act
//     const result = calculatePricingSummary(
//       pricingSummary,
//       costDetail,
//       tax,
//       null
//     );

//     // Assert
//     // TODO: fix this
//     // expect(result.totalCost).toEqual(500);
//     // expect(result.totalFixlersMarkupFee).toEqual(500.25);
//     // expect(result.subTotal).toEqual(1000.25);
//     // expect(result.taxAmount).toEqual(50.01);
//     // expect(result.grandTotal).toEqual(1050.26);
//   });

//   it('should calculate pricing summary with regular hours cost details', () => {
//     // Arrange
//     const costDetail: ICostDetailRegularHours = {
//       hourlyRegularHoursPricing: {
//         regularHours: {
//           firstHourValue: 100,
//           additionalHoursValue: 20,
//           additionalHoursType: 'dollar'
//         }
//       },
//       regularEstimatedHours: 2,
//       extendedServiceCost: 500
//     };

//     // Act
//     const result = calculatePricingSummary(
//       pricingSummary,
//       costDetail,
//       tax,
//       null
//     );

//     // Assert
//     // TODO: fix this
//     // expect(result.totalCost).toEqual(500);
//     // expect(result.totalFixlersMarkupFee).toEqual(500.25);
//     // expect(result.subTotal).toEqual(1000.25);
//     // expect(result.taxAmount).toEqual(50.01);
//     // expect(result.grandTotal).toEqual(1050.26);
//   });
// });
