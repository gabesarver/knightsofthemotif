"use client";

import { Quest, updateQuestStatus, addQuest } from "@/queries/firestoreQuery";
import {
  Accordion,
  Container,
  Form,
  Button,
  Popover,
  OverlayTrigger,
} from "react-bootstrap";
import { useState } from "react";

export default function Quests({ quests }: { quests: Quest[] }) {
  const [showPopover, setShowPopover] = useState(false);
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

  const handleAddQuest = async () => {
    if (!newQuest.title || !newQuest.description) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      await addQuest(newQuest);
      setShowPopover(false);
      setNewQuest({ title: "", description: "", reward: "", status: "active" });
    } catch (error) {
      console.error("Error adding quest:", error);
    }
  };

  const addQuestPopover = (
    <Popover
      id="add-quest-popover"
      style={{ minWidth: "25%", maxWidth: "50%" }}
    >
      <Popover.Header as="h3">Add New Quest</Popover.Header>
      <Popover.Body>
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
          <Button variant="success" size="sm" onClick={handleAddQuest}>
            Add Quest
          </Button>
        </Form>
      </Popover.Body>
    </Popover>
  );

  return (
    <Container style={{ height: "83vh", overflowY: "auto", padding: "1rem" }}>
      <h2 className="text-center mb-3">Quest Log</h2>

      <div className="d-flex justify-content-center mb-3">
        <OverlayTrigger
          trigger="click"
          placement="bottom"
          overlay={addQuestPopover}
          show={showPopover}
          rootClose
        >
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowPopover(true)}
          >
            Add Quest
          </Button>
        </OverlayTrigger>
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
                  <Accordion.Body>{quest.description}</Accordion.Body>
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
                  <Accordion.Body>{quest.description}</Accordion.Body>
                </Accordion.Item>
              ))
          ) : (
            <p>No completed quests.</p>
          )}
        </Accordion>
      </div>
    </Container>
  );
}
