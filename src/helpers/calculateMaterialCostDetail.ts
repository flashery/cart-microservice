import { adminFee } from '../infrastructure/config/symbols';
import { ICartMaterialCostDetail } from '../infrastructure/mappers/ICartMaterialCostDTO';
import { ICartJobMaterialsDTO } from '../infrastructure/mappers/ICartJobMaterialsDTO';
import { ICostDetailFixed } from '../infrastructure/mappers/cost-detail/ICostDetailFixed';
import { ICostDetailAfterHours } from '../infrastructure/mappers/cost-detail/ICostDetailAfterHours';
import { ICostDetailRegularHours } from '../infrastructure/mappers/cost-detail/ICostDetailRegularHours';
import { Fixed } from '../app/domain/entities/cost-detail/Fixed';
import { HourlyAfterHours } from '../app/domain/entities/cost-detail/HourlyAfterHours';
import { HourlyRegularHours } from '../app/domain/entities/cost-detail/HourlyRegularHours';
import { MaterialCostDetail } from '../app/domain/entities/MaterialCostDetail';
import { ICartServiceDTO } from '../infrastructure/mappers/ICartServiceDTO';

/**
 * Calculate material cost detail in service.
 * @param jobMaterials job materials list.
 */
export const calculateMaterialCostDetailInService = (
  jobMaterials: ICartJobMaterialsDTO[]
): ICartMaterialCostDetail => {
  const fixlersMaterialMarkupPct = adminFee.MATERIAL_MARKUP_PTC;
  let fixlersMaterialMarkupFee = 0;
  let totalMaterialCost = 0;

  // logic/calculations comes here
  jobMaterials.forEach((j) => {
    // validations
    if (!j.isProvidedByTechnician || j.status !== 'Approved') return;

    // if status is approved and provided by technician
    totalMaterialCost += Number(j.totalSummary.extendedPrice);
  });

  // material markup fee is apply per material
  fixlersMaterialMarkupFee +=
    Number(totalMaterialCost) * Number(fixlersMaterialMarkupPct / 100);

  return {
    fixlersMaterialMarkupPct,
    // todo: will be use future npm libraries for calculations
    fixlersMaterialMarkupFee: parseFloat(fixlersMaterialMarkupFee.toFixed(2)),
    // todo: will be use future npm libraries for calculations
    totalMaterialCost: parseFloat(totalMaterialCost.toFixed(2))
  };
};

/**
 * Calculate material cost detail.
 * @param costDetail cost detail in a service.
 * @param materialCostDetail material cost detail in a service.
 */
export const calculateExtendedMaterialCost = (
  costDetail: Fixed | HourlyAfterHours | HourlyRegularHours,
  materialCostDetail: MaterialCostDetail
): ICostDetailFixed | ICostDetailAfterHours | ICostDetailRegularHours => {
  // create a new copy of cost detail
  const newCostDetail: ICostDetailFixed = JSON.parse(
    JSON.stringify(costDetail)
  );

  // check if cost detail is fixed pricing
  if (newCostDetail && newCostDetail.fixedPricing) {
    newCostDetail.materialsTotal = materialCostDetail.totalMaterialCost;
    newCostDetail.extendedMaterialsCost =
      materialCostDetail.totalMaterialCost * newCostDetail.quantity;
  }

  return newCostDetail;
};

/**
 * Calculate material cost detail in cart.
 * @param cartServices cart services list.
 */
export const calculateMaterialCostDetailInCart = (
  cartServices: ICartServiceDTO[]
): ICartMaterialCostDetail => {
  const fixlersMaterialMarkupPct = adminFee.MATERIAL_MARKUP_PTC;
  let fixlersMaterialMarkupFee = 0;
  let totalMaterialCost = 0;

  // logic/calculations comes here
  cartServices.forEach((cs) => {
    const costDetail: ICostDetailFixed = JSON.parse(
      JSON.stringify(cs.costDetail)
    );
    // check if cost detail is fixed pricing
    if (costDetail && costDetail.fixedPricing) {
      totalMaterialCost += Number(costDetail.extendedMaterialsCost);
    } else {
      cs.jobMaterials.forEach((j) => {
        // validations
        if (!j.isProvidedByTechnician || j.status !== 'Approved') return;

        // if status is approved and provided by technician
        totalMaterialCost += Number(j.totalSummary.extendedPrice);
      });
    }
  });

  // material markup fee is apply per material
  fixlersMaterialMarkupFee +=
    Number(totalMaterialCost) * Number(fixlersMaterialMarkupPct / 100);

  return {
    fixlersMaterialMarkupPct,
    // todo: will be use future npm libraries for calculations
    fixlersMaterialMarkupFee: parseFloat(fixlersMaterialMarkupFee.toFixed(2)),
    // todo: will be use future npm libraries for calculations
    totalMaterialCost: parseFloat(totalMaterialCost.toFixed(2))
  };
};
