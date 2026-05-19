import { motion } from "framer-motion";

function Home() {

  return (

    <div className="page home-page">

      <motion.div

        initial={{ opacity: 0, y: -50 }}

        animate={{ opacity: 1, y: 0 }}
      >

        <h1>
          AI Product Review Analysis
        </h1>

        <p>
          Analyze customer reviews using AI,
          NLP and Naive Bayes.
        </p>

      </motion.div>

    </div>
  );
}

export default Home;