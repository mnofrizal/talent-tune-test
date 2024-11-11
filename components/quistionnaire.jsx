import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const ANSWER_OPTIONS = [
  "Sangat Paham",
  "Paham",
  "Cukup Paham",
  "Kurang Paham",
  "Tidak Paham",
];

const QuestionCard = ({ questionNumber, question, value, onChange }) => (
  <div className="space-y-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
          {questionNumber}
        </span>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {question.material}
          </h3>
          <p className="mt-2 leading-relaxed text-gray-600">
            {question.statement}
          </p>
        </div>
      </div>
    </div>
    <RadioGroup
      value={value}
      onValueChange={(value) => onChange(question.id, value)}
      className="grid grid-cols-2 gap-3 pt-4 md:grid-cols-5"
    >
      {ANSWER_OPTIONS.map((option) => (
        <div key={option} className="flex items-center justify-center">
          <RadioGroupItem
            value={option}
            id={`${question.id}-${option}`}
            className="peer sr-only"
          />
          <Label
            htmlFor={`${question.id}-${option}`}
            className={cn(
              "flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3",
              "hover:bg-accent hover:text-accent-foreground",
              "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5",
              "[&:has([data-state=checked])]:border-primary cursor-pointer text-center h-full w-full transition-all"
            )}
          >
            <span className="text-sm font-medium leading-none">{option}</span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  </div>
);

const CategorySection = ({
  category,
  questions,
  startIndex,
  answers,
  onAnswerChange,
}) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-semibold text-primary">{category}</h2>
      <Separator className="mt-4" />
    </div>
    <div className="space-y-6">
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          questionNumber={startIndex + index + 1}
          question={question}
          value={answers[question.id]}
          onChange={onAnswerChange}
        />
      ))}
    </div>
  </div>
);

export default function QuestionnaireComponent() {
  const [answers, setAnswers] = useState({});
  const [open, setOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const questions = [
    {
      category: "SMAP",
      items: [
        {
          id: "q1",
          material: "Referensi",
          statement:
            "Pemahaman Keputusan Direksi No. 204.K/010/IP/2019 tentang Kebijakan mengenai Anti Penyuapan di PT Indonesia Power.",
        },
        {
          id: "q2",
          material: "Tujuan",
          statement:
            "Salah satu tujuan Kebijakan Anti Penyuapan adalah untuk Merancang kontrol/pengendalian mitigasi yang efektif untuk mengurangi kesempatan untuk melakukan penyuapan, dan untuk mendeteksi terjadinya penyuapan jika kontrol/pengendalian pencegahan ternyata belum dirancang dengan benar atau beroperasi secara efektif.",
        },
      ],
    },
    {
      category: "GRATIFIKASI",
      items: [
        {
          id: "q3",
          material: "Jenis-jenis",
          statement:
            "Pemberian terkait dengan penyelenggaraan pesta pertunangan, pernikahan, kelahiran, aqiqah, baptis, khitanan, potong gigi, atau upacara adat/agama lainnya paling banyak Rp. 1.000.000,00 (satu juta rupiah) per pemberian per orang dalam setiap kegiatan tidak wajib dilaporkan.",
        },
        {
          id: "q4",
          material: "Tata Cara Pelaporan",
          statement:
            "Pengelolaan Gratifikasi dilakukan oleh UPG (Unit Pengendali Gratifikasi Pusat). Penerimaan dan penolakan Gratifikasi yang wajib dilaporkan kepada UPG melalui aplikasi PROGCG dengan alamat gcg.indonesiapower.co.id:2000 paling lama 10 (sepuluh) hari kerja setelah tanggal penerimaan.",
        },
      ],
    },
    {
      category: "WBS",
      items: [
        {
          id: "q5",
          material: "Pengertian",
          statement:
            "Kebijakan Pengaduan Pelanggaran merupakan sistem yang dapat dijadikan media bagi saksi pelapor untuk menyampaikan informasi mengenai tindakan pelanggaran yang diindikasi terjadi di dalam suatu Perusahaan serta dugaan adanya kelemahan dalam SMAP",
        },
        {
          id: "q6",
          material: "Tata Cara",
          statement:
            "Pelaporan terhadap Pelanggaran dapat dilakukan melalui beberapa media, antara lain : 1. Website Perusahaan www.indonesiapower.co.id 2. Email : pengaduan@indonesiapower.co.id 3. Drop Box 4. Pesan singkat atau WhatsApp ke No. 081-1979-888",
        },
      ],
    },
    {
      category: "CODE OF CONDUCT (ETIKA)",
      items: [
        {
          id: "q7",
          material: "Pengertian",
          statement:
            "Code of Conduct adalah sekumpulan komitmen yang terdiri dari etika bisnis dan etika kerja Pegawai yang disusun untuk mempengaruhi, membentuk, mengatur dan melakukan kesesuaian tingkah laku sehingga tercapai keluaran yang konsisten yang sesuai dengan budaya Perusahaan dalam mencapai visi dan misinya.",
        },
        {
          id: "q8",
          material: "Tujuan",
          statement:
            "Code of Conduct disusun untuk menjadi acuan berperilaku segenap pihak yang berhubungan dengan Indonesia Power sejalan dengan nilai dan budaya yang diharapkan.",
        },
      ],
    },
    {
      category: "CONFLICT OF INTEREST",
      items: [
        {
          id: "q9",
          material: "Pengertian",
          statement:
            "Benturan Kepentingan adalah situasi dimana terdapat konflik kepentingan Insan Indonesia Power memanfaatkan kedudukan dan wewenang yang dimilikinya (baik dengan sengaja maupun tidak sengaja) dalam Perusahaan untuk kepentingan pribadi, keluarga dan golongannya sehingga tugas yang diamanatkan tidak dapat dilaksanakan dengan objektif dan dapat mempengaruhi kualitas keputusan dan/atau tindakannya sehingga berpotensi merugikan Perusahaan.",
        },
        {
          id: "q10",
          material: "Referensi, Tujuan",
          statement:
            "Keputusan Direksi No. 018.K/010/IP/2020 adalah tentang Benturan Kepentingan.",
        },
      ],
    },
  ];

  const totalQuestions = questions.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitted answers:", answers);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-8">Isi Kuisioner</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] max-w-4xl p-0">
        <div className="sticky top-0 z-20 border-b bg-background px-6 pb-4 pt-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-primary">
              Questionnaire SMAP
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Progress ({answeredQuestions} of {totalQuestions} questions)
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-6">
          <div className="space-y-10">
            {questions.map((category, categoryIndex) => {
              const startIndex = questions
                .slice(0, categoryIndex)
                .reduce((acc, cat) => acc + cat.items.length, 0);

              return (
                <CategorySection
                  key={category.category}
                  category={category.category}
                  questions={category.items}
                  startIndex={startIndex}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                />
              );
            })}

            <div className="space-y-6">
              <div className="flex items-start space-x-3 rounded-lg bg-muted/50 p-4">
                <Checkbox
                  id="agreement"
                  checked={agreed}
                  onCheckedChange={setAgreed}
                  className="mt-1"
                />
                <Label htmlFor="agreement" className="text-sm leading-relaxed">
                  Dengan ini Saya telah memahami mengenai SMAP dan berkomitmen
                  untuk mematuhi SMAP dan apabila melanggar, Saya siap mendapat
                  sanksi sesuai ketentuan yang berlaku di Perusahaan.
                </Label>
              </div>

              <Button
                className="w-full py-6 text-lg"
                onClick={handleSubmit}
                disabled={!agreed || progress < 100}
              >
                {progress < 100
                  ? `Please answer all questions (${
                      totalQuestions - answeredQuestions
                    } remaining)`
                  : "Submit Questionnaire"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
