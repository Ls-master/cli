import { getInsightComDefData } from "@/service/metaData/insight";

export default{
  methods: {
    async getInsightRelate(insightId){   //获取关联的从洞见拉取的需要同步的数据
      let res = await getInsightComDefData({
        data: {
          insightRelatedObjectId: insightId,
          describeApiName: this.hostObjInfo.objApiName,
        }
      });
      this.runtime_value = Object.assign({}, this.runtime_value, res.objectData);
    },
    updateTransaction({key, value}){    // 更新交易相关的字段显隐状态等
      if(key){
        this.runtime_value[key] = value;
      }
      let tmpLayoutArr = _.cloneDeep(this.commonLayout) || [];
      tmpLayoutArr.forEach((ii) => {
        (ii.children || []).forEach((iii) => {
          if(!iii || !iii.key) return;
          if(iii.key == "repayment_amount_each_time"){  // 每次还本金金额(固定金额，固定比例)
            if(this.runtime_value["repayment_way"] == 'a_times'){ //若是一次还本，则每次还本金金额隐藏
              iii.hidden = true;
            }else{
              iii.hidden = false;
            }
          }else if(iii.key == "repayment_cycle"){ // 还本金周期
            // if(this.runtime_value["repayment_way"] == 'a_times'){ //初始化若是一次还本,还本金周期默认为一次性，且下拉框置灰
            //   iii.scene.element_props.disabled = true;
            // }else{
            //   iii.scene.element_props.disabled = true;
            // }
          }else if(iii.key == "fixed_ratio"){
            if(this.runtime_value["repayment_way"] == 'a_times'){ //若是一次还本，则隐藏
              iii.hidden = true;
            }else{
              if(this.runtime_value["repayment_amount_each_time"] == 'fixed_ratio'){  // 若是固定比率则显示，否则隐藏
                iii.hidden = false;
              }else{
                iii.hidden = true;
              }
            }
          }else if(iii.key == "fixed_money"){
            if(this.runtime_value["repayment_way"] == 'a_times'){ //若是一次还本，则隐藏
              iii.hidden = true;
            }else{
              if(this.runtime_value["repayment_amount_each_time"] == 'fixed_ratio'){  // 若是固定比率则显示，否则隐藏
                iii.hidden = true;
              }else{
                iii.hidden = false;
              }
            }
          }
        })
      });
      this.commonLayout.splice(0, this.commonLayout.length, ...tmpLayoutArr);
    },
  },
}