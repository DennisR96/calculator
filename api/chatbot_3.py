import uuid
from fastapi import APIRouter
from algorithm import Graph, Workflow
from api.core.workflows import get_workflow

router = APIRouter()


@router.post("/testing/{workflow_id}")
async def testing(
    workflow_id: uuid.UUID,
    messages: list[dict] = [{"role": "user", "content": "Hello, how are you?"}],
):
    """
    Execute a chatbot workflow with given messages.

    Args:
        workflow_id (int): The ID of the workflow to execute.
        messages (list[dict]): List of message dictionaries for the chatbot.

    Returns:
        list[dict]: The chatbot's response messages.
    """

    # Create Workflow
    workflow = get_workflow(workflow_id)
    flow = Graph(nodes=workflow["nodes"], edges=workflow["edges"])

    # Inject Messages into Triggered Nodes
    for n in flow.nodes:
        if n.data.inputs.get("trigger"):
            if n.data.inputs["trigger"].value == True:
                print("Injecting messages into node:")
                n.data.inputs["messages"].value = messages

    # Execute Workflow
    engine = Workflow(flow, streaming=False)
    last_event = await engine.execute(serialize_output=True)

    # Extract outputs from output nodes
    for n in last_event["nodes"]:
        if n["type"] == "Chatbot":
            return n["data"]["outputs"]["messages"]["value"]

    # Fallback if no output found
    return messages
