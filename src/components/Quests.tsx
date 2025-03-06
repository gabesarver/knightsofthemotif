"use client";

import {
  Quest,
  updateQuestStatus,
  addQuest,
  updateQuest,
  deleteQuest,
} from "@/queries/firestoreQuery";
import { Accordion, Container, Form, Button, Modal } from "react-bootstrap";
import { useState } from "react";

export default function Quests({ quests }: { quests: Quest[] }) {
  if (!quests) return null;
  const [showAddQuestModal, setShowAddQuestModal] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [newQuest, setNewQuest] = useState({
    title: "",
    description: "",
    reward: "",
    status: "active",
  });

  const toggleQuestStatus = async (questId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "complete" : "active";
    try {
      await updateQuestStatus(questId, newStatus);
    } catch (error) {
      console.error("Error updating quest status:", error);
    }
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewQuest((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editingQuest) return;
    const { name, value } = event.target;
    setEditingQuest((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleAddQuest = async () => {
    if (!newQuest.title || !newQuest.description) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      await addQuest(newQuest);
      setShowAddQuestModal(false);
      setNewQuest({ title: "", description: "", reward: "", status: "active" });
    } catch (error) {
      console.error("Error adding quest:", error);
    }
  };

  const handleEditQuest = async () => {
    if (!editingQuest) return;

    try {
      await updateQuest(editingQuest.id, {
        title: editingQuest.title,
        description: editingQuest.description,
        reward: editingQuest.reward,
      });
      setEditingQuest(null);
    } catch (error) {
      console.error("Error updating quest:", error);
    }
  };

  return (
    <Container style={{ height: "83vh", overflowY: "auto", padding: "1rem" }}>
      <h2 className="text-center mb-3">Quest Log</h2>

      <div className="d-flex justify-content-center mb-3">
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddQuestModal(true)}
        >
          Add Quest
        </Button>
      </div>

      <div className="mb-4">
        <h3>Active Quests</h3>
        <Accordion>
          {quests.filter((q) => q.status === "active").length > 0 ? (
            quests
              .filter((q) => q.status === "active")
              .map((quest) => (
                <Accordion.Item key={quest.id} eventKey={quest.id}>
                  <Accordion.Header>
                    <Form.Check
                      type="checkbox"
                      checked={quest.status === "complete"}
                      onChange={() => toggleQuestStatus(quest.id, quest.status)}
                      className="me-2"
                    />
                    <strong>{quest.title}</strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>{quest.description}</p>
                    <p>Reward: {quest.reward}</p>
                    <Container style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => setEditingQuest(quest)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteQuest(quest.id)}
                      >
                        Delete
                      </Button>
                    </Container>
                  </Accordion.Body>
                </Accordion.Item>
              ))
          ) : (
            <p>No active quests.</p>
          )}
        </Accordion>
      </div>

      <div>
        <h3>Completed Quests</h3>
        <Accordion>
          {quests.filter((q) => q.status === "complete").length > 0 ? (
            quests
              .filter((q) => q.status === "complete")
              .map((quest) => (
                <Accordion.Item key={quest.id} eventKey={quest.id}>
                  <Accordion.Header>
                    <Form.Check
                      type="checkbox"
                      checked={quest.status === "complete"}
                      onChange={() => toggleQuestStatus(quest.id, quest.status)}
                      className="me-2"
                    />
                    <strong>{quest.title}</strong>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p>{quest.description}</p>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => setEditingQuest(quest)}
                    >
                      Edit
                    </Button>
                  </Accordion.Body>
                </Accordion.Item>
              ))
          ) : (
            <p>No completed quests.</p>
          )}
        </Accordion>
      </div>

      {/* Add Quest Modal */}
      <Modal
        show={showAddQuestModal}
        onHide={() => setShowAddQuestModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Quest</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newQuest.title}
                onChange={handleInputChange}
                placeholder="Quest Title"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={newQuest.description}
                onChange={handleInputChange}
                placeholder="Quest Description"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Reward</Form.Label>
              <Form.Control
                type="text"
                name="reward"
                value={newQuest.reward}
                onChange={handleInputChange}
                placeholder="Reward"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddQuestModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddQuest}>
            Add Quest
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Quest Modal */}
      {editingQuest && (
        <Modal show={true} onHide={() => setEditingQuest(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Quest</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={editingQuest.title}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="description"
                  value={editingQuest.description}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Reward</Form.Label>
                <Form.Control
                  type="text"
                  name="reward"
                  value={editingQuest.reward}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditingQuest(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditQuest}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}
