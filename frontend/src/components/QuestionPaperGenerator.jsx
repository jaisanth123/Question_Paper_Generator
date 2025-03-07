import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const QuestionPaperGenerator = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const rotateX = useTransform(scrollY, [0, 1000], [0, 15]);
  const rotateY = useTransform(scrollY, [0, 1000], [0, 20]);

  // Animation Variants
  const cubeVariants = {
    animate: {
      rotateX: [0, 360],
      rotateY: [0, 360],
      transition: { duration: 10, repeat: Infinity },
    },
  };
  const sphereVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 180],
      transition: { duration: 5, repeat: Infinity },
    },
  };

  // SVG Icons
  const generateIcon = (
    <svg
      className="w-12 h-12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
    >
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
    </svg>
  );
  const monitorIcon = (
    <svg
      className="w-12 h-12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
  const analyticsIcon = (
    <svg
      className="w-12 h-12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
    >
      <path d="M3 12h18M12 3v18M4 6l4 4M16 14l4 4M8 16l4-4M12 8l4 4" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden relative">
      {/* 3D Background Elements */}
      <motion.div
        className="absolute top-5 left-5 w-16 h-16 bg-black opacity-20"
        variants={cubeVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-10 right-10 w-24 h-24 bg-black rounded-full opacity-20"
        variants={sphereVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-1/4 left-1/3 w-20 h-20 bg-black opacity-15"
        style={{ rotateX }}
        variants={cubeVariants}
        animate="animate"
      />

      {/* Hero Section */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-10 left-20 w-28 h-28 bg-black opacity-25"
          variants={sphereVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-40 w-20 h-20 bg-black opacity-20"
          style={{ rotateY }}
          variants={cubeVariants}
          animate="animate"
        />
        <div className="text-center z-10">
          <motion.h1
            className="text-6xl font-extrabold mb-4"
            style={{ y: y1, scale }}
          >
            PaperProctor
          </motion.h1>
          <motion.p
            className="text-xl mb-6 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Advanced AI-driven question paper generation and secure proctoring
            system
          </motion.p>
          <motion.div className="flex justify-center gap-4 mb-8">
            <span className="text-sm font-medium border border-black px-3 py-1 rounded-full">
              AI-Powered
            </span>
            <span className="text-sm font-medium border border-black px-3 py-1 rounded-full">
              Secure
            </span>
            <span className="text-sm font-medium border border-black px-3 py-1 rounded-full">
              Scalable
            </span>
          </motion.div>
          <motion.button
            className="bg-black text-white px-10 py-4 rounded-full text-lg font-bold"
            whileHover={{
              scale: 1.05,
              rotateX: 10,
              boxShadow: "0px 15px 30px rgba(0,0,0,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/proctor">Get Started</Link>
          </motion.button>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="min-h-screen flex items-center justify-center border-t border-black relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.div
          className="absolute top-5 right-10 w-24 h-24 bg-black opacity-20"
          style={{ rotateY }}
          variants={cubeVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-10 left-20 w-16 h-16 bg-black rounded-full opacity-15"
          variants={sphereVariants}
          animate="animate"
        />
        <div className="max-w-6xl mx-auto px-4 z-10">
          <motion.h2
            className="text-4xl font-bold text-center mb-12"
            style={{ rotateX }}
          >
            Core Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: generateIcon,
                title: "3D Paper Generation",
                desc: "Create dynamic, randomized question papers with AI assistance.",
                extra: "Supports multiple formats: MCQ, Essay, Coding",
              },
              {
                icon: monitorIcon,
                title: "Spatial Monitoring",
                desc: "Real-time 3D proctoring with face and screen tracking.",
                extra: "99.9% accuracy in cheat detection",
              },
              {
                icon: analyticsIcon,
                title: "Depth Analytics",
                desc: "Detailed insights with 3D visualization of performance.",
                extra: "Exportable reports in PDF/CSV",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl border border-black"
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{
                  y: -10,
                  rotate: 2,
                  boxShadow: "10px 10px 0px #000",
                }}
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="mb-2">{feature.desc}</p>
                <p className="text-sm italic">{feature.extra}</p>
              </motion.div>
            ))}
          </div>
          <motion.div className="mt-12 text-center">
            <p className="text-lg font-medium">
              Trusted by 500+ institutions worldwide
            </p>
            <div className="flex justify-center gap-4 mt-4">
              {["School", "University", "Corp"].map((item) => (
                <span
                  key={item}
                  className="border border-black px-4 py-2 rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="min-h-screen flex items-center justify-center border-t border-black relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.div
          className="absolute top-10 left-1/4 w-20 h-20 bg-black opacity-20"
          style={{ rotateX, rotateY }}
          variants={cubeVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-24 h-24 bg-black rounded-full opacity-25"
          variants={sphereVariants}
          animate="animate"
        />
        <div className="max-w-5xl mx-auto px-4 z-10">
          <motion.h2
            className="text-4xl font-bold text-center mb-12"
            style={{ y: y1 }}
          >
            How It Works
          </motion.h2>
          <div className="space-y-8">
            {[
              {
                step: "Setup Exam",
                desc: "Configure exam parameters and question types.",
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="black">
                    <path d="M12 2v6h6M6 18h12" />
                  </svg>
                ),
              },
              {
                step: "Generate Paper",
                desc: "AI creates a unique paper instantly.",
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="black">
                    <path d="M3 3h18v18H3z" />
                  </svg>
                ),
              },
              {
                step: "Monitor & Analyze",
                desc: "Track in real-time and get detailed reports.",
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="black">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center bg-white border border-black rounded-lg p-4"
                initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <motion.div
                  className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0"
                  whileHover={{ scale: 1.2, rotate: 90 }}
                >
                  {index + 1}
                </motion.div>
                <div className="ml-4 flex-1 flex items-center">
                  {item.icon}
                  <div className="ml-4">
                    <p className="font-bold text-lg">{item.step}</p>
                    <p className="text-sm">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div className="mt-8 text-center">
            <p className="text-sm">
              Supports 10+ languages | 24/7 Support | GDPR Compliant
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="min-h-screen flex items-center justify-center border-t border-black relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.div
          className="absolute top-5 right-1/3 w-28 h-28 bg-black opacity-20"
          style={{ rotateY }}
          variants={cubeVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-10 left-1/3 w-20 h-20 bg-black rounded-full opacity-15"
          variants={sphereVariants}
          animate="animate"
        />
        <div className="text-center z-10">
          <motion.h2
            className="text-4xl font-bold mb-6"
            style={{ scale, rotateX }}
          >
            Ready to Revolutionize Testing?
          </motion.h2>
          <motion.p className="text-lg mb-8 max-w-md mx-auto">
            Join thousands of educators enhancing exams with PaperProctor
          </motion.p>
          <motion.button
            className="bg-black text-white px-12 py-5 rounded-full text-xl font-bold relative overflow-hidden"
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 20px 40px rgba(0,0,0,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Start Free Trial</span>
            <motion.span
              className="absolute inset-0 bg-white opacity-0"
              whileHover={{ opacity: 0.1, scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          <motion.div className="mt-6 flex justify-center gap-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="black">
                <path d="M5 13l4 4L19 7" />
              </svg>{" "}
              Free 30-day trial
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="black">
                <path d="M5 13l4 4L19 7" />
              </svg>{" "}
              No credit card required
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="py-12 border-t border-black relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute top-2 left-5 w-16 h-16 bg-black opacity-20"
          variants={cubeVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-2 right-5 w-20 h-20 bg-black rounded-full opacity-15"
          variants={sphereVariants}
          animate="animate"
        />
        <div className="max-w-5xl mx-auto px-4 z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold mb-4">PaperProctor</h4>
            <p className="text-sm">
              Transforming education with AI and 3D technology.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Links</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-sm">Email: support@paperproctor.com</p>
            <p className="text-sm">Phone: +1-800-PROCTOR</p>
          </div>
        </div>
        <div className="text-center mt-8 text-sm">
          © 2025 PaperProctor. All rights reserved.
        </div>
      </motion.footer>
    </div>
  );
};

export default QuestionPaperGenerator;
