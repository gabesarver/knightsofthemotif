"use client";

import {
  Item,
  deleteItemFromBag,
  updateItemInBag,
} from "@/queries/firestoreQuery";
import { useState } from "react";
import { Button, Accordion, Form, Container, Modal } from "react-bootstrap";
import { addItemToBag } from "@/queries/firestoreQuery"; // Import Firestore function
import { Trash } from "lucide-react";

export default function BagOfHolding({ bag }: { bag: Item[] }) {
  if (!bag) return null;
  const [addingItem, setAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
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

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingItem) return;
    const { name, value } = event.target;
    setEditingItem((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  async function handleAddItem() {
    if (!newItem.name || !newItem.quantity) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      await addItemToBag(newItem);
      console.log("Item added:", newItem);
      setAddingItem(false);
      setNewItem({ name: "", quantity: "1", value: 0, details: "" });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  const handleEditItem = async () => {
    if (!editingItem) return;

    try {
      await updateItemInBag(editingItem.id, {
        name: editingItem.name,
        details: editingItem.details,
        quantity: editingItem.quantity,
        value: editingItem.value,
      });
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating quest:", error);
    }
  };

  return (
    <Container style={{ height: "83vh", overflowY: "auto", padding: "1rem" }}>
      <h2 className="d-flex justify-content-center mb-3">Bag of Holding</h2>

      {/* Add Item Button */}
      <div className="d-flex justify-content-center mb-3">
        <Button variant="primary" size="sm" onClick={() => setAddingItem(true)}>
          Add Item
        </Button>
      </div>

      {/* Add Item Modal */}
      {addingItem && (
        <Modal show={true} onHide={() => setAddingItem(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setAddingItem(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddItem}>
              Add Item
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Bag of Holding Items */}
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
              <Button
                variant="warning"
                size="sm"
                onClick={() => setEditingItem(item)}
              >
                Edit
              </Button>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Edit Item Modal */}
      {editingItem && (
        <Modal show={true} onHide={() => setEditingItem(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={editingItem.name}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={editingItem.quantity}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Value</Form.Label>
                <Form.Control
                  type="string"
                  name="value"
                  value={editingItem.value}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="details"
                  value={editingItem.details}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditItem}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}
