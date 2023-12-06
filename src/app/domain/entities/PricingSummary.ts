import { MaterialCostDetail } from './MaterialCostDetail';
import { ServiceCostDetail } from './cost-detail/ServiceCostDetail';

export class PricingSummary {
  constructor(
    public materialCostDetail: MaterialCostDetail,
    public serviceCostDetail: ServiceCostDetail,
    public totalCost: number,
    public totalFixlersMarkupFee: number,
    public subTotal: number,
    public taxPct: number,
    public taxAmount: number,
    public grandTotal: number
  ) {}
}
