'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import YouTube from 'react-youtube';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../lib/firebase';
import { ArrowLeft, CheckCircle, Circle, PlayCircle, Clock, BookOpen } from 'lucide-react';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [params.id]);

  const loadCourse = async () => {
    try {
      const docRef = doc(db, 'courses', params.id as string);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const courseData = {
          id: docSnap.id,
          title: data.title || 'Untitled Course',
          description: data.description || '',
          thumbnail: data.thumbnail || '',
          modules: data.modules || []
        };
        
        setCourse(courseData);
        
        // Set first video
        if (courseData.modules.length > 0 && 
            courseData.modules[0].videos && 
            courseData.modules[0].videos.length > 0) {
          setCurrentVideo(courseData.modules[0].videos[0]);
        }
      }
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectVideo = (video: any) => {
    setCurrentVideo(video);
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-tsok-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Course not found</p>
          <Link href="/courses" className="btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/courses" className="text-tsok-blue hover:text-blue-900">
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
                <h1 className="text-xl font-bold text-tsok-blue">{course.title}</h1>
                <p className="text-xs text-gray-600">TSOK Learning Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            {currentVideo ? (
              <div className="card p-0 overflow-hidden">
                <div className="aspect-video bg-black">
                  <YouTube
                    videoId={currentVideo.youtubeId}
                    opts={opts}
                    className="w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-tsok-blue mb-2">
                    {currentVideo.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentVideo.duration}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{currentVideo.description}</p>
                </div>
              </div>
            ) : (
              <div className="card">
                <p className="text-center text-gray-600 py-12">
                  Select a video from the course content to start learning
                </p>
              </div>
            )}
          </div>

          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Course Content</span>
              </h3>
              
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {course.modules && course.modules.length > 0 ? (
                  course.modules.map((module: any, moduleIndex: number) => (
                    <div key={moduleIndex} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-semibold text-gray-800 mb-3">{module.title}</h4>
                      <div className="space-y-2">
                        {module.videos && module.videos.length > 0 ? (
                          module.videos.map((video: any, videoIndex: number) => (
                            <button
                              key={videoIndex}
                              onClick={() => selectVideo(video)}
                              className={`w-full text-left p-3 rounded-lg transition-all ${
                                currentVideo?.id === video.id
                                  ? 'bg-tsok-blue text-white'
                                  : 'bg-gray-50 hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="mt-1">
                                  {currentVideo?.id === video.id ? (
                                    <PlayCircle className="w-5 h-5" />
                                  ) : (
                                    <Circle className="w-5 h-5" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm line-clamp-2">
                                    {video.title}
                                  </p>
                                  <p className="text-xs opacity-75 mt-1">
                                    {video.duration}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 py-2">No videos</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-4">No modules available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
