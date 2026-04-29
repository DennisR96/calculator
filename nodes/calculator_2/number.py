from typing import Annotated

from schemas import Metadata, Handler
from nodes import Node


class Number(Node):
    metadata = Metadata(
        icon="circle-plus",
        category="Calculator",
    )

    def execute(
        self,
        number: Annotated[
            float,
            Handler(
                description="Insert an Example Number",
                handle_type="menu",
                renderer="number",
                value=22,
            ),
        ],
    ) -> Annotated[
        float, Handler(handle_name="number", handle_type="output", renderer="number")
    ]:
        """Allows Number Input"""
        return number

    def quality(self, node, graph):
        return []
