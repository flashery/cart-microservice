import { PricingSummary } from '../app/domain/entities/PricingSummary';
import { ServiceCostDetail } from '../app/domain/entities/cost-detail/ServiceCostDetail';
import { IStateTax } from '../infrastructure/mappers/IStateTax';
import { ICostDetailAfterHours } from '../infrastructure/mappers/cost-detail/ICostDetailAfterHours';
import { ICostDetailFixed } from '../infrastructure/mappers/cost-detail/ICostDetailFixed';
import { ICostDetailRegularHours } from '../infrastructure/mappers/cost-detail/ICostDetailRegularHours';
import { adminFee } from '../infrastructure/config/symbols';
import { roundTwoDecimals, add, divide, mutiply } from './mathHelper';
import { ICartJobMaterialsDTO } from '../infrastructure/mappers/ICartJobMaterialsDTO';
import { MaterialCostDetail } from '../app/domain/entities/MaterialCostDetail';
import { calculateMaterialCostDetailInService } from './calculateMaterialCostDetail';

/**
 * Returns a ServiceCostDetail object containing the total service cost, Fixler's service markup percentage and markup fee
 * @param costDetail - An ICostDetailFixed, ICostDetailAfterHours, or ICostDetailRegularHours object
 * @returns A ServiceCostDetail object
 */
export function getServiceCostDetail(
  costDetail: ICostDetailFixed | ICostDetailAfterHours | ICostDetailRegularHours
): ServiceCostDetail {
  // Get the service markup percentage from the admin fee
  const SERVICE_MARKUP_PTC = adminFee.SERVICE_MARKUP_PTC ?? 0;

  let totalServiceCost = 0;

  // Check if costDetail is an ICostDetailFixed object
  if ((costDetail as ICostDetailFixed)?.fixedPricing !== undefined) {
    // Get total service cost from ICostDetailFixed object
    totalServiceCost = (costDetail as ICostDetailFixed)?.extendedServiceCost;
  }
  // Check if costDetail is an ICostDetailAfterHours or ICostDetailRegularHours object
  else {
    // Get total service cost from ICostDetailAfterHours or ICostDetailRegularHours object
    totalServiceCost = (
      costDetail as ICostDetailAfterHours | ICostDetailRegularHours
    )?.extendedServiceCost;
  }

  // Calculate Fixler's service markup fee
  const fixlersServiceMarkupFee = roundTwoDecimals(
    mutiply(divide(SERVICE_MARKUP_PTC, 100), totalServiceCost)
  );

  // Return ServiceCostDetail object with total service cost, Fixler's service markup percentage, and markup fee
  return {
    totalServiceCost,
    fixlersServiceMarkupPct: SERVICE_MARKUP_PTC,
    fixlersServiceMarkupFee
  };
}

export function getMaterialCostDetail(
  jobMaterials: ICartJobMaterialsDTO[],
  costDetail: ICostDetailFixed | ICostDetailAfterHours | ICostDetailRegularHours
): MaterialCostDetail {
  // Get the service markup percentage from the admin fee
  const MATERIAL_MARKUP_PTC = adminFee.MATERIAL_MARKUP_PTC ?? 0;

  let totalMaterialCost = 0;

  // Check if costDetail is an ICostDetailFixed object
  if ((costDetail as ICostDetailFixed)?.fixedPricing !== undefined) {
    // Get total service cost from ICostDetailFixed object
    totalMaterialCost = (costDetail as ICostDetailFixed)?.extendedMaterialsCost;
  } else {
    const materialCost = calculateMaterialCostDetailInService(jobMaterials);
    totalMaterialCost = materialCost.totalMaterialCost || 0;
  }

  // Calculate Fixler's service markup fee
  const fixlersMaterialMarkupFee = roundTwoDecimals(
    mutiply(divide(MATERIAL_MARKUP_PTC, 100), totalMaterialCost)
  );

  // Return ServiceCostDetail object with total service cost, Fixler's service markup percentage, and markup fee
  return {
    fixlersMaterialMarkupPct: MATERIAL_MARKUP_PTC,
    totalMaterialCost,
    fixlersMaterialMarkupFee
  };
}

/**
 * Calculates the pricing summary for a job based on the pricing summary,
 * cost detail, and state tax provided.
 * @param pricingSummary - The pricing summary object containing material cost details.
 * @param costDetail - The cost detail object containing service cost details.
 * @param tax - The tax object containing the state tax percentage.
 * @returns The updated pricing summary object with total cost and tax information.
 */
export default function calculatePricingSummary(
  pricingSummary: PricingSummary,
  costDetail:
    | ICostDetailFixed
    | ICostDetailAfterHours
    | ICostDetailRegularHours,
  tax: IStateTax,
  mcd: MaterialCostDetail | null
): PricingSummary {
  // Get the material cost detail from the pricing summary object
  const materialCostDetail = mcd || pricingSummary.materialCostDetail;
  // Get the service cost detail using the costDetail object
  const serviceCostDetail = getServiceCostDetail(costDetail);

  // Calculate the total cost of the job by adding the material and service costs
  const totalCost: number = roundTwoDecimals(
    add(
      materialCostDetail.totalMaterialCost,
      serviceCostDetail.totalServiceCost
    )
  );

  // Calculate the total Fixlers markup fees by adding the material and service markup fees
  const totalFixlersMarkupFee: number = roundTwoDecimals(
    add(
      materialCostDetail.fixlersMaterialMarkupFee,
      serviceCostDetail.fixlersServiceMarkupFee
    )
  );

  // Calculate the subtotal by adding the total cost and markup fees
  const subTotal: number = roundTwoDecimals(
    add(totalCost, totalFixlersMarkupFee)
  );

  // Get the tax percentage from the tax object
  const taxPct: number = roundTwoDecimals(tax.taxPer);

  // Calculate the tax amount based on the tax percentage and subtotal
  const taxAmount: number = roundTwoDecimals(
    mutiply(divide(taxPct, 100), subTotal)
  );

  // Calculate the grand total by adding the subtotal and tax amount
  const grandTotal: number = roundTwoDecimals(add(subTotal, taxAmount));

  if (
    !costDetail ||
    costDetail.isCustomQuoteJob === undefined ||
    costDetail.isCustomQuoteJob === true
  )
    return {
      materialCostDetail: {
        totalMaterialCost: 0,
        fixlersMaterialMarkupPct: 0,
        fixlersMaterialMarkupFee: 0
      },
      serviceCostDetail: {
        totalServiceCost: 0,
        fixlersServiceMarkupPct: 0,
        fixlersServiceMarkupFee: 0
      },
      totalCost: 0,
      totalFixlersMarkupFee: 0,
      subTotal: 0,
      taxPct,
      taxAmount: 0,
      grandTotal: 0
    };

  // Return the updated pricing summary object with all the calculated values
  return {
    materialCostDetail,
    serviceCostDetail,
    totalCost,
    totalFixlersMarkupFee,
    subTotal,
    taxPct,
    taxAmount,
    grandTotal
  };
}
