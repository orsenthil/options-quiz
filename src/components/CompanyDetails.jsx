import React from 'react';
import { Card, CardContent } from './ui/card';
import { Building2, Users2, Globe2, BarChart3, DollarSign, Briefcase } from 'lucide-react';

const CompanyDetails = ({ stockPrice, strikePrice, premium, companyDetails }) => {
    const formatMarketCap = (marketCap) => {
        if (!marketCap) return 'N/A';
        if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
        if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
        if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
        return `$${marketCap.toFixed(2)}`;
    };

    const formatEmployees = (employees) => {
        if (!employees) return 'N/A';
        if (employees >= 1000) return `${(employees / 1000).toFixed(1)}k`;
        return employees.toString();
    };

    return (
        <div className="space-y-4">
            {/* Company Overview */}
            {companyDetails && (
                <Card className="bg-white">
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                            {companyDetails.logo && (
                                <img
                                    src={companyDetails.logo}
                                    alt={`${companyDetails.name} logo`}
                                    className="w-16 h-16 object-contain"
                                />
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">{companyDetails.name}</h3>
                                <p className="text-sm text-gray-500">{companyDetails.finnhubIndustry}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex items-center space-x-2">
                                <Building2 className="w-4 h-4 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Market Cap</p>
                                    <p className="font-medium">{formatMarketCap(companyDetails.marketCapitalization)}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Users2 className="w-4 h-4 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Employees</p>
                                    <p className="font-medium">{formatEmployees(companyDetails.employeeTotal)}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Globe2 className="w-4 h-4 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Country</p>
                                    <p className="font-medium">{companyDetails.country || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Currency</p>
                                    <p className="font-medium">{companyDetails.currency || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <BarChart3 className="w-4 h-4 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Exchange</p>
                                    <p className="font-medium">{companyDetails.exchange || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Briefcase className="w-4 h-4 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">IPO Date</p>
                                    <p className="font-medium">{companyDetails.ipo || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Option Details */}
            <Card className="bg-white">
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Option Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Current Stock Price</p>
                            <p className="font-medium">${stockPrice}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Strike Price</p>
                            <p className="font-medium">${strikePrice}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Option Premium</p>
                            <p className="font-medium">${premium} per share</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Cost</p>
                            <p className="font-medium">${(parseFloat(premium) * 100).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Trade Date</p>
                            <p className="font-medium">{new Date().toISOString().split('T')[0]}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CompanyDetails;