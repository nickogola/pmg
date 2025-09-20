import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Landing = () => {
  const { isLoggedIn, user } = useAuthStore();

  const features = [
    {
      title: "Property Management",
      description: "Efficiently manage multiple properties, units, and tenants from a single dashboard.",
      icon: "🏢"
    },
    {
      title: "Tenant Portal",
      description: "Allow tenants to submit maintenance requests, pay rent, and communicate directly.",
      icon: "👥"
    },
    {
      title: "Maintenance Tracking",
      description: "Track and manage maintenance tickets with automated notifications and status updates.",
      icon: "🔧"
    },
    {
      title: "Payment Processing",
      description: "Collect rent and fees online with automated payment reminders and receipts.",
      icon: "💰"
    },
    {
      title: "Announcement System",
      description: "Broadcast important updates and announcements to all tenants or specific properties.",
      icon: "📣"
    },
    {
      title: "Financial Reporting",
      description: "Generate detailed financial reports for income, expenses, and occupancy rates.",
      icon: "📊"
    }
  ];

  const testimonials = [
    {
      name: "Jane Cooper",
      role: "Property Manager",
      image: "/assets/images/testimonials/jane.jpg",
      quote: "This system has revolutionized how we manage our properties. The maintenance ticketing system alone has saved us countless hours."
    },
    {
      name: "Robert Johnson",
      role: "Landlord",
      image: "/assets/images/testimonials/robert.jpg",
      quote: "I can now manage multiple properties with ease. The payment processing and reporting features are game-changers for my business."
    },
    {
      name: "Sarah Williams",
      role: "Tenant",
      image: "/assets/images/testimonials/sarah.jpg",
      quote: "As a tenant, I love being able to pay rent online and submit maintenance requests without calling the property manager."
    }
  ];

  // If user is logged in, redirect to appropriate dashboard
  const renderCTA = () => {
    if (isLoggedIn) {
      const dashboardPath = user?.userType === 'Tenant' ? '/tenant/dashboard' : '/admin/dashboard';
      
      return (
        <Link 
          to={dashboardPath}
          className="mt-8 inline-block rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white shadow-md hover:bg-indigo-700"
        >
          Go to Dashboard
        </Link>
      );
    } else {
      return (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/register"
            className="rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white shadow-md hover:bg-indigo-700"
          >
            Get Started
          </Link>
          <Link 
            to="/login"
            className="rounded-md bg-white px-8 py-3 text-base font-medium text-indigo-600 shadow-md hover:bg-gray-50 border border-indigo-200"
          >
            Sign In
          </Link>
        </div>
      );
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Simplify your</span>{' '}
                  <span className="block text-indigo-600 xl:inline">property management</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  A comprehensive solution for property owners and tenants. 
                  Streamline maintenance requests, automate rent collection, 
                  and improve communication.
                </p>
                
                {renderCTA()}
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-indigo-100">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <span className="text-8xl">🏢</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your properties
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our comprehensive platform offers tools for both property managers and tenants.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg text-3xl">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.title}</h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white">Trusted by property managers and tenants</h2>
            <p className="mt-4 text-lg text-indigo-100">
              See what our users have to say about our platform.
            </p>
          </div>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-8">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                        {testimonial.image ? (
                          <img src={testimonial.image} alt={testimonial.name} className="h-12 w-12 rounded-full" />
                        ) : (
                          testimonial.name.charAt(0)
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                        <div className="text-base text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                    <p className="mt-4 text-base text-gray-500 italic">"{testimonial.quote}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-600">Sign up today or contact us for a demo.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Contact sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
