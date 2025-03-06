"use client";

import { Gold } from "@/queries/firestoreQuery";
import { updateGold } from "@/queries/firestoreQuery";
import { useState } from "react";
import { Button, Form, Col, Row, Container } from "react-bootstrap";

export default function GoldMenu({ gold }: { gold: Gold[] }) {
  if (!gold.length) return null;
  const [inputValues, setInputValues] = useState<{ [key: string]: number }>({});

  let players = Object.keys(gold[0].personal_gold.players).sort();

  // Function to handle gold updates
  const handleGoldChange = async (
    playerName: string,
    field: "bank" | "on_person",
    amount: number
  ) => {
    const goldEntry = gold[0];
    const newValue =
      goldEntry.personal_gold.players[playerName][field] + amount;

    if (newValue < 0) return;

    const updatedGold = {
      ...goldEntry,
      personal_gold: {
        ...goldEntry.personal_gold,
        players: {
          ...goldEntry.personal_gold.players,
          [playerName]: {
            ...goldEntry.personal_gold.players[playerName],
            [field]: newValue,
          },
        },
      },
    };

    try {
      await updateGold(goldEntry.id, {
        personal_gold: updatedGold.personal_gold,
      });
      setInputValues((prev) => ({ ...prev, [`${playerName}-${field}`]: 0 }));
      // console.log(`Updated ${playerName}'s ${field} gold by ${amount}`);
    } catch (error) {
      console.error("Error updating gold:", error);
    }
  };

  const handleInputChange = (
    playerName: string,
    field: "bank" | "on_person",
    value: string
  ) => {
    setInputValues((prev) => ({
      ...prev,
      [`${playerName}-${field}`]: Number(value) || 0,
    }));
  };

  return (
    <Container style={{ height: "83vh", overflowY: "auto", padding: "1rem" }}>
      <h4 className="text-center">Gold Management</h4>
      {gold.map((g) =>
        players.map((player) => {
          const data = g.personal_gold.players[player];
          return (
            <div key={player} className="mb-2">
              <h5 className="text-center">{player}</h5>
              <p className="text-center">
                Total Gold: {data.bank + data.on_person}
              </p>
              <Row className="text-center">
                <Col>
                  <strong>On Person</strong>
                  <p>{data.on_person}</p>
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() =>
                        handleGoldChange(
                          player,
                          "on_person",
                          inputValues[`${player}-on_person`] || 1
                        )
                      }
                    >
                      +
                    </Button>
                    <Form.Control
                      type="number"
                      min="0"
                      className="mx-1 text-center"
                      style={{ width: "100px" }}
                      value={inputValues[`${player}-on_person`] || ""}
                      onChange={(e) =>
                        handleInputChange(player, "on_person", e.target.value)
                      }
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        handleGoldChange(
                          player,
                          "on_person",
                          -(inputValues[`${player}-on_person`] || 1)
                        )
                      }
                    >
                      -
                    </Button>
                  </div>
                </Col>
                <Col>
                  <strong>Bank</strong>
                  <p>{data.bank}</p>
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() =>
                        handleGoldChange(
                          player,
                          "bank",
                          inputValues[`${player}-bank`] || 1
                        )
                      }
                    >
                      +
                    </Button>
                    <Form.Control
                      type="number"
                      min="0"
                      className="mx-1 text-center"
                      style={{ width: "100px" }}
                      value={inputValues[`${player}-bank`] || ""}
                      onChange={(e) =>
                        handleInputChange(player, "bank", e.target.value)
                      }
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() =>
                        handleGoldChange(
                          player,
                          "bank",
                          -(inputValues[`${player}-bank`] || 1)
                        )
                      }
                    >
                      -
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          );
        })
      )}
    </Container>
  );
}
