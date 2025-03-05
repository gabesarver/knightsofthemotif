"use client";

import { Item, deleteItemFromBag } from "@/queries/firestoreQuery";
import { useState } from "react";
import {
  Button,
  Accordion,
  Form,
  Popover,
  OverlayTrigger,
  Container,
} from "react-bootstrap";
import { addItemToBag } from "@/queries/firestoreQuery"; // Import Firestore function
import { Trash } from "lucide-react";

export default function BagOfHolding({ bag }: { bag: Item[] }) {
  const [addingItem, setAddingItem] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [newItem, setNewItem] = useState<{
    name: string;
    quantity: string;
    value: number;
    details: string;
  }>({
    name: "",
    quantity: "1",
    value: 0,
    details: "",
  });

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddItem() {
    if (!newItem.name || !newItem.quantity) {
      alert("Please fill in all required fields!");
      return;
    }

    const itemToAdd: Item = {
      name: newItem.name,
      quantity: newItem.quantity,
      value: newItem.value,
      details: newItem.details,
    };

    try {
      await addItemToBag(itemToAdd);
      console.log("Item added:", itemToAdd);
      setAddingItem(false);
      setShowPopover(false);
      setNewItem({ name: "", quantity: "1", value: 0, details: "" });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  const addItemPopover = (
    <Popover id="add-item-popover" style={{ minWidth: "25%", maxWidth: "50%" }}>
      <Popover.Header as="h3">Add New Item</Popover.Header>
      <Popover.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Value</Form.Label>
            <Form.Control
              type="text"
              name="value"
              value={newItem.value}
              onChange={handleInputChange}
              placeholder="Value"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="details"
              value={newItem.details}
              onChange={handleInputChange}
              placeholder="Details"
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="success" size="sm" onClick={handleAddItem}>
              Add
            </Button>
          </div>
        </Form>
      </Popover.Body>
    </Popover>
  );

  return (
    <Container style={{height: "83vh", overflowY: "auto", padding: "1rem" }}>
      <h2 className="d-flex justify-content-center mb-3">Bag of Holding</h2>
      <div className="d-flex justify-content-center mb-3">
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={addItemPopover}
          show={showPopover}
          rootClose
        >
          <Button variant="primary" size="sm" onClick={() => setShowPopover(true)}>
            Add Item
          </Button>
        </OverlayTrigger>
      </div>

      {addingItem && (
        <div>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleInputChange}
                placeholder="Name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="text"
                name="value"
                value={newItem.value}
                onChange={handleInputChange}
                placeholder="Value"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="details"
                value={newItem.details}
                onChange={handleInputChange}
                placeholder="Details"
              />
            </Form.Group>
          </Form>

          <Button variant="success" size="sm" onClick={handleAddItem}>
            Add
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setAddingItem(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      <Accordion>
        {bag.map((item, index) => (
          <Accordion.Item key={index} eventKey={index.toString()}>
            <div className="d-flex justify-content-between align-items-center">
              <Accordion.Button as="div" className="flex-grow-1">
                {item.name}
              </Accordion.Button>
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents accordion toggle
                  deleteItemFromBag(item.id);
                }}
                style={{ marginRight: "1rem" }}
              >
                <Trash />
              </Button>
            </div>
            <Accordion.Body>
              <p>Quantity: {item.quantity}</p>
              <p>Value: {item.value}</p>
              <p>Details: {item.details}</p>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}
