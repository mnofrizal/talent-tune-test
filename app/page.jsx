"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Users, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="#">
          <Zap className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">TalentTune</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Contact
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Revolutionize Your HR Assessments
                </h1>
                <p className="mx-auto mt-4 max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  TalentTune helps you make data-driven decisions in your hiring
                  process. Streamline your assessments and find the perfect fit
                  for your team.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link href="/dashboard">
                  <Button size="lg" className="mt-6">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="w-full bg-gray-100 py-12 dark:bg-gray-800 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
              Key Features
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart2 className="mr-2 h-6 w-6" />
                      Advanced Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Gain deep insights into candidate performance with our
                      powerful analytics tools.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-6 w-6" />
                      Collaborative Assessments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Work together with your team to evaluate candidates
                      efficiently and effectively.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="mr-2 h-6 w-6" />
                      AI-Powered Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Leverage artificial intelligence to uncover hidden talents
                      and predict candidate success.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Transform Your HR Process?
                </h2>
                <p className="mx-auto mt-4 max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Join thousands of companies already using TalentTune to find
                  and nurture top talent.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <Link href="/dashboard">
                  <Button size="lg" className="mt-6">
                    Start Free Trial
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 TalentTune. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
