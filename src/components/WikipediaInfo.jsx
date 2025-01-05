import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const WikipediaInfo = ({ companyName }) => {
    const [wikiData, setWikiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWikiInfo = async () => {
            if (!companyName) return;

            setLoading(true);
            setError(null);

            try {
                // Search for the company's Wikipedia page using company name
                const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${companyName} company&format=json&origin=*`;
                const searchResponse = await fetch(searchUrl);
                const searchData = await searchResponse.json();

                if (searchData.query.search.length === 0) {
                    throw new Error('No Wikipedia page found for this company');
                }

                // Get the page ID of the first result
                const pageId = searchData.query.search[0].pageid;

                // Fetch the extract of the Wikipedia page
                const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids=${pageId}&format=json&origin=*`;
                const extractResponse = await fetch(extractUrl);
                const extractData = await extractResponse.json();

                const pageContent = extractData.query.pages[pageId];
                setWikiData({
                    title: pageContent.title,
                    extract: pageContent.extract
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWikiInfo();
    }, [companyName]);

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Data from Wikipedia</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="text-gray-600">Loading company information...</div>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {wikiData && (
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{wikiData.title}</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {wikiData.extract?.split('\n')[0]}
                        </p>
                        <a
                            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(wikiData.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Read more on Wikipedia
                        </a>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default WikipediaInfo;