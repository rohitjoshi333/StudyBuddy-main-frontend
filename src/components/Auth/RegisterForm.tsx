import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const COURSE_CATEGORIES = {
  'Computer Science': ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'TypeScript', 'HTML/CSS', 'SQL', 'MongoDB'],
  'Data Science': ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Jupyter', 'Tableau', 'Power BI'],
  'Mobile Development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Dart', 'Xamarin', 'Ionic', 'Android Studio', 'Xcode'],
  'Web Development': ['JavaScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'HTML/CSS', 'TypeScript', 'PHP', 'Laravel'],
  'Backend Development': ['Node.js', 'Python', 'Java', 'C#', 'Go', 'Ruby', 'PHP', 'Express.js', 'Django', 'Spring Boot'],
  'DevOps': ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'AWS', 'Azure', 'GCP', 'Linux', 'Bash', 'Ansible'],
  'Cybersecurity': ['Python', 'Kali Linux', 'Wireshark', 'Metasploit', 'Nmap', 'Burp Suite', 'OWASP', 'Penetration Testing'],
  'Game Development': ['C#', 'Unity', 'Unreal Engine', 'C++', 'Blender', 'Game Design', 'Physics', '3D Modeling'],
  'AI/Machine Learning': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV', 'NLP', 'Computer Vision', 'Deep Learning'],
  'Blockchain': ['Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts', 'DeFi', 'Cryptocurrency', 'Truffle', 'Hardhat']
};

const PREDEFINED_INTERESTS = [
  'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning',
  'Artificial Intelligence', 'Cybersecurity', 'Cloud Computing', 'DevOps',
  'UI/UX Design', 'Game Development', 'Blockchain', 'IoT', 'Robotics',
  'Computer Vision', 'Natural Language Processing', 'Big Data', 'Analytics',
  'Software Engineering', 'System Design', 'Database Design', 'API Development',
  'Frontend Development', 'Backend Development', 'Full Stack Development',
  'Quality Assurance', 'Project Management', 'Agile Methodology'
];

const UNIVERSITIES = [
  'MIT', 'Stanford University', 'Harvard University', 'UC Berkeley',
  'Carnegie Mellon University', 'Georgia Tech', 'University of Washington',
  'University of Illinois', 'University of Texas at Austin', 'Caltech',
  'Princeton University', 'Yale University', 'Columbia University',
  'Cornell University', 'University of Michigan', 'UCLA', 'USC',
  'NYU', 'Boston University', 'Northeastern University'
];

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const { register, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    year: '',
    bio: '',
    selectedCategories: [] as string[],
    courses: [] as string[],
    interests: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.courses.length === 0) {
      setError('Please select at least one course/skill');
      return;
    }

    if (formData.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        course: formData.courses.join(', '),
        year: formData.year,
        university: formData.university,
        bio: formData.bio,
        interests: formData.interests,
        skills: formData.courses,
        studyStyle: 'group',
        availability: { days: [], timeSlots: [] },
        preferences: { studyEnvironment: [], goals: [] }
      });
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
  };

  const toggleCourse = (course: string) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(course)
        ? prev.courses.filter(c => c !== course)
        : [...prev.courses, course]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const getAvailableCourses = () => {
    if (formData.selectedCategories.length === 0) return [];
    
    const courses = new Set<string>();
    formData.selectedCategories.forEach(category => {
      COURSE_CATEGORIES[category as keyof typeof COURSE_CATEGORIES]?.forEach(course => {
        courses.add(course);
      });
    });
    return Array.from(courses);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    if (step === 2) {
      if (!formData.university || !formData.year) {
        setError('Please fill in all required fields');
        return;
      }
    }
    if (step === 3) {
      if (formData.selectedCategories.length === 0) {
        setError('Please select at least one course category');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-xl inline-block mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Join thousands of students collaborating
          </p>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-3 h-3 rounded-full ${
                    stepNum <= step ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="you@university.edu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Academic Info */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  University *
                </label>
                <select
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select your university</option>
                  {UNIVERSITIES.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Academic Year *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Tell us about yourself and your study goals..."
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Course Categories */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Select Your Course Categories * (Choose multiple)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.keys(COURSE_CATEGORIES).map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        formData.selectedCategories.includes(category)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
                      }`}
                    >
                      <span className="font-medium">{category}</span>
                      {formData.selectedCategories.includes(category) && (
                        <Check className="h-5 w-5" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Selected: {formData.selectedCategories.length} categories
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 4: Specific Courses */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Select Specific Courses/Skills * (Based on your categories)
                </label>
                {getAvailableCourses().length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                    {getAvailableCourses().map((course) => (
                      <button
                        key={course}
                        type="button"
                        onClick={() => toggleCourse(course)}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                          formData.courses.includes(course)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600'
                        }`}
                      >
                        <span className="text-sm font-medium">{course}</span>
                        {formData.courses.includes(course) && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Please select course categories first
                  </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Selected: {formData.courses.length} courses
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 5: Interests */}
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Select Your Interests * (Choose multiple)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                  {PREDEFINED_INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                        formData.interests.includes(interest)
                          ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-secondary-300 dark:hover:border-secondary-600'
                      }`}
                    >
                      <span className="text-sm font-medium">{interest}</span>
                      {formData.interests.includes(interest) && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Selected: {formData.interests.length} interests
                </p>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          {/* Navigation Buttons */}
          <div className="flex space-x-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
            )}
            
            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 transition-all"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={onToggleMode}
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Sign in
            </button>
          </p>
          
          {/* Help Section */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Need help? We're here for you! Contact us at{' '}
              <a href="mailto:support@studybuddy.com" className="font-medium underline">
                support@studybuddy.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterForm;