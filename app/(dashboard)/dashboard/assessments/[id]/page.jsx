"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, X } from "lucide-react";

const dummyParticipants = [
  {
    id: 1,
    nama: "John Doe",
    nip: "123456",
    jabatan: "Manager",
    tanggalJabatan: "2023-01-01",
    bidang: "IT",
    peg: "PEG001",
    pendidikan: "S1 Informatika",
    email: "john.doe@example.com",
    photoUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    nama: "Jane Smith",
    nip: "789012",
    jabatan: "Developer",
    tanggalJabatan: "2023-02-15",
    bidang: "Engineering",
    peg: "PEG002",
    pendidikan: "S1 Teknik Komputer",
    email: "jane.smith@example.com",
    photoUrl: "https://i.pravatar.cc/150?img=2",
  },
];

const proyeksiJenjangMapping = {
  G2: "Struktural",
  G3: "Fungsional",
  Technician: "Fungsional",
};

const evaluators = [
  { id: "gm1", name: "GM 1", email: "gm1@example.com" },
  { id: "gm2", name: "GM 2", email: "gm2@example.com" },
  { id: "manager1", name: "Manager 1", email: "manager1@example.com" },
];

const rooms = ["Ruang Rapat 1", "Ruang Rapat 2", "Ruang Rapat 3"];

const managerTLPositions = [
  { id: "manager1", name: "Manager 1", email: "manager1@example.com" },
  { id: "manager2", name: "Manager 2", email: "manager2@example.com" },
  { id: "tl1", name: "Team Lead 1", email: "tl1@example.com" },
  { id: "tl2", name: "Team Lead 2", email: "tl2@example.com" },
];

export default function AssessmentDetailsPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    jabatan: "",
    tanggalJabatan: "",
    bidang: "",
    peg: "",
    proyeksiJenjang: "",
    proyeksiJenisJabatan: "",
    pendidikan: "",
    email: "",
    photoUrl: "",
    atasan1: "",
    emailAtasan1: "",
    judul: "",
    tanggalPelaksanaan: "",
    waktuPelaksanaan: { start: "", end: "" },
    metodePelaksanaan: "",
    ruangan: "",
    linkVirtualMeeting: "",
    dokumen: "",
    evaluators: [{ id: "", email: "" }],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "proyeksiJenjang") {
        newData.proyeksiJenisJabatan = proyeksiJenjangMapping[value] || "";
      }

      if (name === "metodePelaksanaan") {
        newData.ruangan = "";
        newData.linkVirtualMeeting = "";
      }

      if (name === "atasan1") {
        const selectedAtasan = managerTLPositions.find((a) => a.id === value);
        newData.emailAtasan1 = selectedAtasan ? selectedAtasan.email : "";
      }

      return newData;
    });
  };

  const handleParticipantSelect = (participantId) => {
    const selectedParticipant = dummyParticipants.find(
      (p) => p.id.toString() === participantId
    );
    if (selectedParticipant) {
      setFormData((prev) => ({
        ...prev,
        ...selectedParticipant,
        proyeksiJenjang: "",
        proyeksiJenisJabatan: "",
        atasan1: "",
        emailAtasan1: "",
      }));
    }
  };

  const handleEvaluatorChange = (index, field, value) => {
    setFormData((prev) => {
      const newEvaluators = [...prev.evaluators];
      newEvaluators[index] = { ...newEvaluators[index], [field]: value };
      if (field === "id") {
        const selectedEvaluator = evaluators.find((e) => e.id === value);
        newEvaluators[index].email = selectedEvaluator
          ? selectedEvaluator.email
          : "";
      }
      return { ...prev, evaluators: newEvaluators };
    });
  };

  const addEvaluator = () => {
    setFormData((prev) => ({
      ...prev,
      evaluators: [...prev.evaluators, { id: "", email: "" }],
    }));
  };

  const removeEvaluator = (index) => {
    setFormData((prev) => ({
      ...prev,
      evaluators: prev.evaluators.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Here you would typically send the form data to your API
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      <h1 className="text-3xl font-bold">Assessment Details</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="judul">Judul</Label>
                  <Input
                    id="judul"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="tanggalPelaksanaan">
                    Tanggal Pelaksanaan
                  </Label>
                  <Input
                    id="tanggalPelaksanaan"
                    name="tanggalPelaksanaan"
                    type="date"
                    value={formData.tanggalPelaksanaan}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="waktuPelaksanaan">Waktu Pelaksanaan</Label>
                  <div className="flex gap-2">
                    <Input
                      id="waktuPelaksanaanStart"
                      name="waktuPelaksanaan.start"
                      type="time"
                      value={formData.waktuPelaksanaan.start}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "waktuPelaksanaan",
                            value: {
                              ...formData.waktuPelaksanaan,
                              start: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <Input
                      id="waktuPelaksanaanEnd"
                      name="waktuPelaksanaan.end"
                      type="time"
                      value={formData.waktuPelaksanaan.end}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: "waktuPelaksanaan",
                            value: {
                              ...formData.waktuPelaksanaan,
                              end: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="metodePelaksanaan">Metode Pelaksanaan</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("metodePelaksanaan", value)
                    }
                    value={formData.metodePelaksanaan}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.metodePelaksanaan === "offline" && (
                  <div>
                    <Label htmlFor="ruangan">Ruangan</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("ruangan", value)
                      }
                      value={formData.ruangan}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Room" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms.map((room) => (
                          <SelectItem key={room} value={room}>
                            {room}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {formData.metodePelaksanaan === "online" && (
                  <div>
                    <Label htmlFor="linkVirtualMeeting">
                      Link Virtual Meeting
                    </Label>
                    <Input
                      id="linkVirtualMeeting"
                      name="linkVirtualMeeting"
                      value={formData.linkVirtualMeeting}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="dokumen">Dokumen</Label>
                  <Input
                    id="dokumen"
                    name="dokumen"
                    value={formData.dokumen}
                    onChange={handleInputChange}
                    placeholder="Link to uploaded document"
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Evaluators</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <AnimatePresence>
                {formData.evaluators.map((evaluator, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 items-end gap-4"
                  >
                    <div>
                      <Label htmlFor={`evaluator${index + 1}`}>
                        Evaluator {index + 1}
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleEvaluatorChange(index, "id", value)
                        }
                        value={evaluator.id}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Evaluator" />
                        </SelectTrigger>
                        <SelectContent>
                          {evaluators.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {e.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-grow">
                        <Label htmlFor={`emailEvaluator${index + 1}`}>
                          Email Evaluator {index + 1}
                        </Label>
                        <Input
                          id={`emailEvaluator${index + 1}`}
                          name={`emailEvaluator${index + 1}`}
                          type="email"
                          value={evaluator.email}
                          onChange={(e) =>
                            handleEvaluatorChange(
                              index,
                              "email",
                              e.target.value
                            )
                          }
                          disabled
                        />
                      </div>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeEvaluator(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {formData.evaluators.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEvaluator}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Evaluator
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      <motion.div
        layout
        className={`grid ${
          formData.nama ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"
        } gap-6`}
      >
        <motion.div
          layout
          className={formData.nama ? "col-span-1 md:col-span-2" : "col-span-1"}
        >
          <Card>
            <CardHeader>
              <CardTitle>Candidate Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="nama">Nama Peserta</Label>
                    <Select
                      onValueChange={(value) => handleParticipantSelect(value)}
                      value={formData.id?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Participant" />
                      </SelectTrigger>
                      <SelectContent>
                        {dummyParticipants.map((participant) => (
                          <SelectItem
                            key={participant.id}
                            value={participant.id.toString()}
                          >
                            {participant.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nip">NIP</Label>
                    <Input
                      id="nip"
                      name="nip"
                      value={formData.nip}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="jabatan">Jabatan</Label>
                    <Input
                      id="jabatan"
                      name="jabatan"
                      value={formData.jabatan}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="tanggalJabatan">Tanggal Jabatan</Label>
                    <Input
                      id="tanggalJabatan"
                      name="tanggalJabatan"
                      type="date"
                      value={formData.tanggalJabatan}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="bidang">Bidang</Label>
                    <Input
                      id="bidang"
                      name="bidang"
                      value={formData.bidang}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="peg">PeG</Label>
                    <Input
                      id="peg"
                      name="peg"
                      value={formData.peg}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="proyeksiJenjang">Proyeksi Jenjang</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("proyeksiJenjang", value)
                      }
                      value={formData.proyeksiJenjang}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="G2">G2</SelectItem>
                        <SelectItem value="G3">G3</SelectItem>
                        <SelectItem value="Technician">Technician</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="proyeksiJenisJabatan">
                      Proyeksi Jenis Jabatan
                    </Label>
                    <Input
                      id="proyeksiJenisJabatan"
                      name="proyeksiJenisJabatan"
                      value={formData.proyeksiJenisJabatan}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="pendidikan">Pendidikan</Label>
                    <Input
                      id="pendidikan"
                      name="pendidikan"
                      value={formData.pendidikan}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="atasan1">Atasan 1</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("atasan1", value)
                      }
                      value={formData.atasan1}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Atasan 1" />
                      </SelectTrigger>
                      <SelectContent>
                        {managerTLPositions.map((position) => (
                          <SelectItem key={position.id} value={position.id}>
                            {position.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="emailAtasan1">Email Atasan 1</Label>
                    <Input
                      id="emailAtasan1"
                      name="emailAtasan1"
                      type="email"
                      value={formData.emailAtasan1}
                      onChange={handleInputChange}
                      disabled
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {formData.nama && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={formData.photoUrl} alt={formData.nama} />
                  <AvatarFallback>
                    {formData.nama
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold">{formData.nama}</h2>
                <p className="text-muted-foreground">{formData.email}</p>
                <p className="text-muted-foreground">NIP: {formData.nip}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Save
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </motion.div>
  );
}
