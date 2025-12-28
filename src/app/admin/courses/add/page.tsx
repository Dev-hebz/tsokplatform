'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { isAdmin } from '../../../../lib/adminAuth';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save,
  Video,
  BookOpen,
  AlertCircle
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  duration: string;
  description: string;
  order: number;
}

interface Module {
  id: string;
  title: string;
  videos: Video[];
}

export default function AddEditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = params?.id ? true : false;
  const courseId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/admin/login');
      } else {
        const adminStatus = await isAdmin(currentUser.uid);
        if (!adminStatus) {
          alert('Access denied. Admin privileges required.');
          router.push('/courses');
          return;
        }
        if (isEdit) {
          fetchCourse();
        } else {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCourse = async () => {
    try {
      const docRef = doc(db, 'courses', courseId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || '');
        setDescription(data.description || '');
        setCategory(data.category || '');
        setThumbnail(data.thumbnail || '');
        setModules(data.modules || []);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Error loading course');
    } finally {
      setLoading(false);
    }
  };

  const addModule = () => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: '',
      videos: []
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (index: number, field: string, value: string) => {
    const updatedModules = [...modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setModules(updatedModules);
  };

  const deleteModule = (index: number) => {
    if (confirm('Are you sure you want to delete this module?')) {
      setModules(modules.filter((_, i) => i !== index));
    }
  };

  const addVideo = (moduleIndex: number) => {
    const newVideo: Video = {
      id: `video-${Date.now()}`,
      title: '',
      youtubeId: '',
      duration: '',
      description: '',
      order: modules[moduleIndex].videos.length + 1
    };
    
    const updatedModules = [...modules];
    updatedModules[moduleIndex].videos.push(newVideo);
    setModules(updatedModules);
  };

  const updateVideo = (moduleIndex: number, videoIndex: number, field: string, value: string) => {
    const updatedModules = [...modules];
    updatedModules[moduleIndex].videos[videoIndex] = {
      ...updatedModules[moduleIndex].videos[videoIndex],
      [field]: value
    };
    setModules(updatedModules);
  };

  const deleteVideo = (moduleIndex: number, videoIndex: number) => {
    if (confirm('Are you sure you want to delete this video?')) {
      const updatedModules = [...modules];
      updatedModules[moduleIndex].videos = updatedModules[moduleIndex].videos.filter((_, i) => i !== videoIndex);
      setModules(updatedModules);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);

    try {
      const courseData = {
        title,
        description,
        category,
        thumbnail: thumbnail || `https://i.ytimg.com/vi/${modules[0]?.videos[0]?.youtubeId || 'dQw4w9WgXcQ'}/maxresdefault.jpg`,
        modules,
        updatedAt: new Date().toISOString()
      };

      if (isEdit) {
        await setDoc(doc(db, 'courses', courseId), courseData);
        alert('Course updated successfully!');
      } else {
        await addDoc(collection(db, 'courses'), {
          ...courseData,
          createdAt: new Date().toISOString()
        });
        alert('Course created successfully!');
      }

      router.push('/admin');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-tsok-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-tsok-blue hover:text-blue-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <Image
                src="/tsok-logo.png"
                alt="TSOK Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-tsok-blue">
                  {isEdit ? 'Edit Course' : 'Add New Subject'}
                </h1>
                <p className="text-xs text-gray-600">TSOK Admin Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Course Information */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-tsok-blue" />
              <span>Course Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Introduction to Teaching Methods"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder="Describe what students will learn in this course"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Pedagogy, Technology, Assessment"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="input-field"
                  placeholder="https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to auto-generate from first video
                </p>
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <Video className="w-6 h-6 text-tsok-blue" />
                <span>Course Modules</span>
              </h2>
              <button
                type="button"
                onClick={addModule}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Module</span>
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No modules yet</h3>
                <p className="text-gray-500 mb-4">Add your first module to organize course content</p>
                <button
                  type="button"
                  onClick={addModule}
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add First Module</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Module {moduleIndex + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => deleteModule(moduleIndex)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Module Title *
                      </label>
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                        className="input-field"
                        placeholder="e.g., Module 1: Foundations of Teaching"
                        required
                      />
                    </div>

                    {/* Videos in Module */}
                    <div className="ml-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Videos</h4>
                        <button
                          type="button"
                          onClick={() => addVideo(moduleIndex)}
                          className="text-sm btn-secondary flex items-center space-x-1 py-2 px-3"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Video</span>
                        </button>
                      </div>

                      {module.videos.map((video, videoIndex) => (
                        <div key={video.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                            <p className="text-sm font-medium text-gray-600">Video {videoIndex + 1}</p>
                            <button
                              type="button"
                              onClick={() => deleteVideo(moduleIndex, videoIndex)}
                              className="text-red-600 hover:bg-red-100 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Video Title *
                              </label>
                              <input
                                type="text"
                                value={video.title}
                                onChange={(e) => updateVideo(moduleIndex, videoIndex, 'title', e.target.value)}
                                className="input-field text-sm"
                                placeholder="e.g., Introduction to Pedagogy"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                YouTube Video ID *
                              </label>
                              <input
                                type="text"
                                value={video.youtubeId}
                                onChange={(e) => updateVideo(moduleIndex, videoIndex, 'youtubeId', e.target.value)}
                                className="input-field text-sm"
                                placeholder="dQw4w9WgXcQ"
                                required
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                From: youtube.com/watch?v=<strong>VIDEO_ID</strong>
                              </p>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Duration *
                              </label>
                              <input
                                type="text"
                                value={video.duration}
                                onChange={(e) => updateVideo(moduleIndex, videoIndex, 'duration', e.target.value)}
                                className="input-field text-sm"
                                placeholder="15:30"
                                required
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Description *
                              </label>
                              <textarea
                                value={video.description}
                                onChange={(e) => updateVideo(moduleIndex, videoIndex, 'description', e.target.value)}
                                className="input-field text-sm"
                                rows={2}
                                placeholder="Brief description of what this video covers"
                                required
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      ))}

                      {module.videos.length === 0 && (
                        <div className="text-center py-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
                          <p className="text-sm text-gray-500">No videos in this module yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="card bg-gray-50">
            <div className="flex items-center justify-between">
              <Link
                href="/admin"
                className="btn-secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{isEdit ? 'Update Subject' : 'Create Subject'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Help Info */}
          <div className="card bg-blue-50 border-2 border-blue-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Quick Tips:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Upload videos to YouTube as <strong>Unlisted</strong> first</li>
                  <li>• Get the video ID from the URL (youtube.com/watch?v=<strong>VIDEO_ID</strong>)</li>
                  <li>• Changes are saved to Firebase and appear instantly to all users</li>
                  <li>• You can reorder videos later by editing their order numbers</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
