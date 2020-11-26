({
    init: function (cmp) {
        console.log('starting init '); 
        var flow = cmp.find("flowHolder");        
        var expid = cmp.get('v.expid');
        var flowName = cmp.get('v.flowName');
          console.log(expid);         

        var inputVariables = [
               {
                  name: 'expid',
                   type: 'String',
                   value: expid
              }           
        ];
console.log(inputVariables);

        flow.startFlow(flowName, inputVariables);
    }
})