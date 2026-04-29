import polars as pl
from typing import Annotated

from nodes import Node
from schemas import Metadata, Handler


class Adder(Node):
    metadata = Metadata(
        name="Adder",
        description="Adds two numbers together.",
        icon="sheet",
        category="file",
    )

    def execute(
        self,
        number_1: Annotated[
            float,
            Handler(
                handle_name="number_1", handle_type="menu", renderer="exampleinput"
            ),
        ],
        number_2: Annotated[
            float,
            Handler(
                handle_name="number_1", handle_type="menu", renderer="exampleinput"
            ),
        ],
    ) -> Annotated[
        float,
        Handler(handle_name="result", handle_type="output", renderer="exampleoutput"),
    ]:
        result = number_1 + number_2
        print(result)
        return result

    def quality_graph(self, nodes, graph):
        return 0
