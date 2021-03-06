const executionsManager = require("../execution-manager");

const BaseController = require('../models/base-controller.model');

class ExecutionController extends BaseController{

    /**
     * registering and executing action.
     */
    async add(req, res){
        const action = req.body.action;
        const settings = req.body.settings;

        const [executionId, iterationIndex, actionId] = action.uniqueRunId.split('|');

        action._id = actionId;
        const executionData = {executionId, action, settings};

        const result = await executionsManager.execute(executionData);
        if (result.status === 'error') {
            res.status(500);
        } else {
            res.status(200);
        }
        return res.send(JSON.stringify(result));
    }

    /**
     * Killing an action
     */
    async cancel(req, res){
        try {
            const killedAAction = executionsManager.killAction(req.body.mapId, req.body.actionId);

            if (killedAAction) {
                return res.status(204).send();
            }

            return res.status(404).send();
        } catch (error) {
            return res.status(500).send(error);
        }
    }
}

const executionController = new ExecutionController();
module.exports = executionController;
