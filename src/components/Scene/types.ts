export interface DianGuiDataI {
  /**储能柜单元编号 */
  unitCode: number
  /**储能柜相编号 */
  phaseCode: string
  /**运行状态  1：停机 2：待机 3：充电 4：放电 其他值:未知 */
  runStatus: { val: string }
  /**索引 */
  index: number
}
